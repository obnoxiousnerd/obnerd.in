#!/usr/bin/env fish

# This script helps me create posts, likes and notes automatically.
# Creation options are interactive, make sure to use a non-dumb terminal.
#
# Usage:
# ./new.fish [option]
# Options:
# -l / --like [url?] Create a like for url
# -n / --note Create a note
# -p / --post Create a post

if test -z (command -v gum)
    echo "Gum is not installed. Install it from \
https://github.com/charmbracelet/gum"
    exit 1
end

# File prefix = [Four digit year]-[ISO week number]
set file_time_ident (date +"%Y-%V")
# Directory of site source
set cwd (dirname (status --current-filename))
set cwd (path normalize "$cwd/../")

argparse "l/like=?" "n/note" "p/post" -- $argv
or exit 2

if set -q _flag_like
    if test -n _flag_like
        set like_url $_flag_like
    else
        set like_url (gum input --placeholder "What post do you want to like?")
    end
    
    # This helps create files as 2022-31-01, 2022-31-02
    # [Year]-[ISO Week number]-[nth file this week]
    set likes (count (ls "$cwd/views/likes" | grep $file_time_ident))
    or set likes 0
    
    echo "---
url: $like_url
date: $(date -Iseconds)
---
" > "$cwd/views/likes/$file_time_ident-$(math $likes+1 | xargs printf '%02d').md"

    exit

else if set -q _flag_note
    set note_title (gum input --placeholder "Title of note")

    echo -e "Hit ESC to save contents\n"
    set note_content (gum write --width 80 --placeholder "What goes into this note?")
    echo -e "\x1b[2A\x1b[2K" # Erase the message telling how to exit
    if gum confirm "Is this a reply to another post?"
        set note_reply_to (gum input --placeholder "URL of post replying to")
    end

    set notes (count (ls "$cwd/views/notes" | grep $file_time_ident))
    or set notes 0

    set note "---
title: $note_title
reply: $note_reply_to
date: $(date -Iseconds)
---
$note_content
"
    set note_filename "$cwd/views/notes/$file_time_ident-$(math $notes+1 | xargs printf '%02d').md"
    echo $note > $note_filename
    # If post is not a reply, remove the `url` frontmatter property
    if ! set -q note_reply_to
        sed -i '2d' $note_filename
    end
    exit

else if set -q _flag_post
    set -x post_title (gum input --placeholder "Title")
    if test -z $post_title
        echo "Post title is required"
        exit 2
    end
    set post_description (gum input --placeholder "Description")
    set post_date (date +"%Y-%m-%d")
    set post_tags (gum input --placeholder "Tags (YAML syntax)")
    set post "---
title: $post_title
description: $post_description
date: $post_date
tags: $post_tags
draft: true
---"
    # convert post title to kebab case
    set post_filename (node -e "console.log(process.env.post_title.replaceAll(' ', '-').toLocaleLowerCase())")
    echo $post > "$cwd/views/posts/$post_filename.md"
    exit
else
    echo "Can't guess what you wanted me to do."
    exit 2
end
