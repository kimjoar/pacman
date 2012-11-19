# Pacman

Pacman is a fast static site generator, built for large sites with many files.

This is still a work in progress, and in no way ready for production.

    Usage: pacman [options]

    Options:

      -h, --help            output usage information
      -V, --version         output the version number

      -d, --dev             dev mode: serve content directly
      -b, --build           build mode: build a complete version, with packed assets

      -s, --server          start a server from the build directory
      -p, --port <value>    specify a different server port (default 3000)

      -c, --config <value>  specify a different config file (default ./config.js)
      -f, --from <value>    specify a different source directory (default ./content)
      -t, --target <value>  specify a different target directory (default ./public)
      -r, --rsync <target>  rsync target dir to remote server or local dir
