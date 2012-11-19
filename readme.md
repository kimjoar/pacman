# Pacman

Pacman is a fast static site generator, built for large sites with many files.

This is still a work in progress, and in no way ready for production.

    Usage: pacman [options]

    Options:

      -h, --help            output usage information
      -V, --version         output the version number

      -d, --dev             dev mode: serve content directly
      -p, --port <port>     specify a different server port (default 3000)

      -b, --build           build mode: build a complete version, with packed assets
      -s, --server          start a server from the target directory
      -r, --rsync <target>  rsync target dir to remote server or local dir

      --config <path>       change config file       (default ./config.js)
      --source <path>       change source directory  (default ./content)
      --target <path>       change target directory  (default ./public)

