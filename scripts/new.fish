#!/usr/bin/fish

function createfile -a newfile -a url
    set datestr "date:" (date -Iseconds)
    echo -e "\055--" >>$newfile
    echo -e "url: \"$url\"" >>$newfile
    echo -e "$datestr" >>$newfile
    echo -e "\055--" >>$newfile
end

if test (count $argv) -ne 2
    echo "Usage: new.fish [type] [url]"
    echo -e "Supported types: note"
    exit 2
end

set type $argv[1]
set url $argv[2]

if test $type = note
    set newfile (printf "views/notes/%s.md" (date "+%Y-%m-%d-%H-%M"))
    createfile $newfile $url
    echo $newfile
end
