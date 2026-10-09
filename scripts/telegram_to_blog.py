#!/usr/bin/env python3
"""Manage portfolio blog posts through Telegram.

The bot polls Telegram (getUpdates), applies the commands it receives from the
allowed chat to public/posts.json, and replies with a confirmation. The last
processed update is tracked in .blog/telegram-state.json so messages are only
handled once.

Commands (send to your bot):
  /post Title            first line = title, remaining lines = body
  <plain text>           same as /post
  /edit <ref>            replace the post (new title line + body)
  /delete <ref>          remove the post
  /list                  show every post with its slug
  /help                  show this help

<ref> is a post slug, a unique slug prefix, a unique part of the title, or you
can simply *reply* to the Telegram message that created the post.

Environment variables:
  TELEGRAM_BOT_TOKEN  (required)  token from @BotFather
  TELEGRAM_CHAT_ID    (required)  chat/user id allowed to publish
"""

import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS_FILE = ROOT / "public" / "posts.json"
STATE_FILE = ROOT / ".blog" / "telegram-state.json"

TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
ALLOWED_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "").strip()

HELP_TEXT = (
    "Blog commands:\n"
    "/post Title\n"
    "Body on the following lines\n\n"
    "/edit <slug>\n"
    "New title\n"
    "New body\n\n"
    "/delete <slug>\n"
    "/list\n\n"
    "Tip: reply to a post's original message with /edit or /delete to target it."
)

CREATE_COMMANDS = {"/post", "/new", "/create"}
EDIT_COMMANDS = {"/edit"}
DELETE_COMMANDS = {"/delete", "/del", "/remove"}
LIST_COMMANDS = {"/list", "/posts"}
HELP_COMMANDS = {"/help", "/start"}


def load_json(path, default):
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            print(f"Warning: could not parse {path}, using default", file=sys.stderr)
    return default


def save_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )


def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def unique_slug(base, taken):
    base = base or "post"
    slug = base
    counter = 2
    while slug in taken:
        slug = f"{base}-{counter}"
        counter += 1
    taken.add(slug)
    return slug


def parse_content(text):
    text = (text or "").strip()
    if not text:
        return None
    lines = text.splitlines()
    title = lines[0].strip()
    if not title:
        return None
    body = "\n".join(lines[1:]).strip()
    return title, body


def parse_command(text):
    """Return (command, rest) for a message, or (None, text) for plain text."""
    text = (text or "").strip()
    if not text.startswith("/"):
        return None, text
    parts = text.split(None, 1)
    command = parts[0].split("@")[0].lower()
    rest = parts[1] if len(parts) > 1 else ""
    return command, rest


def find_by_id(posts, post_id):
    for post in posts:
        if post.get("id") == post_id:
            return post
    return None


def find_by_ref(posts, ref):
    ref = (ref or "").strip().lower()
    if not ref:
        return None
    for post in posts:
        if str(post.get("slug", "")).lower() == ref or str(post.get("id", "")).lower() == ref:
            return post
    matches = [
        post for post in posts if str(post.get("slug", "")).lower().startswith(ref)
    ]
    if len(matches) == 1:
        return matches[0]
    matches = [post for post in posts if ref in str(post.get("title", "")).lower()]
    if len(matches) == 1:
        return matches[0]
    return None


def telegram_get_updates(offset):
    params = {
        "offset": offset,
        "timeout": 0,
        "allowed_updates": json.dumps(["message"]),
    }
    url = f"https://api.telegram.org/bot{TOKEN}/getUpdates?" + urllib.parse.urlencode(
        params
    )
    with urllib.request.urlopen(url, timeout=30) as resp:
        payload = json.loads(resp.read().decode("utf-8"))
    if not payload.get("ok"):
        raise RuntimeError(f"Telegram API error: {payload}")
    return payload.get("result", [])


def telegram_send_message(chat_id, text):
    params = {"chat_id": chat_id, "text": text, "disable_web_page_preview": True}
    data = urllib.parse.urlencode(params).encode("utf-8")
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    with urllib.request.urlopen(url, data=data, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def timestamp_from(message):
    date = message.get("date")
    if date:
        return datetime.fromtimestamp(date, tz=timezone.utc).isoformat()
    return datetime.now(tz=timezone.utc).isoformat()


def process_updates(posts, updates, allowed_chat_id):
    """Apply updates to posts in place. Returns (max_update_id, replies)."""
    known_ids = {post.get("id") for post in posts}
    taken_slugs = {post.get("slug") for post in posts}
    replies = []
    max_update_id = -1

    for update in updates:
        max_update_id = max(max_update_id, update.get("update_id", -1))
        message = update.get("message") or {}
        chat = message.get("chat") or {}
        if str(chat.get("id", "")) != allowed_chat_id:
            continue

        text = message.get("text")
        if text is None:
            continue

        reply = message.get("reply_to_message") or {}
        reply_id = (
            f"{chat.get('id')}-{reply.get('message_id')}"
            if reply.get("message_id")
            else None
        )

        command, rest = parse_command(text)

        if command in CREATE_COMMANDS or (command is None and not rest.startswith("/")):
            content = rest if command in CREATE_COMMANDS else text
            parsed = parse_content(content)
            post_id = f"{chat.get('id')}-{message.get('message_id')}"
            if not parsed or post_id in known_ids:
                continue
            title, body = parsed
            slug = unique_slug(slugify(title), taken_slugs)
            posts.insert(
                0,
                {
                    "id": post_id,
                    "slug": slug,
                    "title": title,
                    "date": timestamp_from(message),
                    "body": body,
                },
            )
            known_ids.add(post_id)
            replies.append((chat.get("id"), f'✅ Created "{title}"\nslug: {slug}'))
            continue

        if command in EDIT_COMMANDS:
            if reply_id:
                target = find_by_id(posts, reply_id)
                new_content = rest
            else:
                ref, _, remainder = rest.partition("\n")
                target = find_by_ref(posts, ref)
                new_content = remainder
            parsed = parse_content(new_content)
            if target is None:
                replies.append(
                    (chat.get("id"), "❌ Couldn't find that post. Try /list.")
                )
            elif not parsed:
                replies.append(
                    (
                        chat.get("id"),
                        "❌ Send the new content after the reference:\n"
                        "/edit <slug>\nNew title\nNew body",
                    )
                )
            else:
                target["title"], target["body"] = parsed
                replies.append(
                    (chat.get("id"), f'✏️ Updated "{target["title"]}"')
                )
            continue

        if command in DELETE_COMMANDS:
            if reply_id:
                target = find_by_id(posts, reply_id)
            else:
                target = find_by_ref(posts, rest.strip().splitlines()[0] if rest.strip() else "")
            if target is None:
                replies.append(
                    (chat.get("id"), "❌ Couldn't find that post. Try /list.")
                )
            else:
                posts.remove(target)
                replies.append((chat.get("id"), f'🗑️ Deleted "{target["title"]}"'))
            continue

        if command in LIST_COMMANDS:
            if not posts:
                replies.append((chat.get("id"), "No posts yet."))
            else:
                lines = [
                    f'• {post.get("slug")} — {post.get("title")}' for post in posts
                ]
                replies.append((chat.get("id"), "Posts:\n" + "\n".join(lines)))
            continue

        if command in HELP_COMMANDS:
            replies.append((chat.get("id"), HELP_TEXT))

    return max_update_id, replies


def main():
    if not TOKEN:
        print("TELEGRAM_BOT_TOKEN is not set.", file=sys.stderr)
        return 1
    if not ALLOWED_CHAT_ID:
        print("TELEGRAM_CHAT_ID is not set.", file=sys.stderr)
        return 1

    posts_data = load_json(POSTS_FILE, {"posts": []})
    posts = posts_data.get("posts", []) if isinstance(posts_data, dict) else posts_data
    if not isinstance(posts, list):
        posts = []

    state = load_json(STATE_FILE, {"offset": 0})
    offset = int(state.get("offset", 0))

    try:
        updates = telegram_get_updates(offset)
    except Exception as exc:  # noqa: BLE001 - surface any network/API failure
        print(f"Failed to fetch Telegram updates: {exc}", file=sys.stderr)
        return 1

    max_update_id, replies = process_updates(posts, updates, ALLOWED_CHAT_ID)

    if max_update_id < 0:
        print("No new updates.")
        return 0

    save_json(POSTS_FILE, {"posts": posts})
    save_json(STATE_FILE, {"offset": max_update_id + 1})

    for chat_id, reply in replies:
        try:
            telegram_send_message(chat_id, reply)
        except Exception as exc:  # noqa: BLE001 - never fail the sync over a reply
            print(f"Could not send reply: {exc}", file=sys.stderr)

    print(f"Processed {len(updates)} update(s), {len(replies)} repl(ies).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
