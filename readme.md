![Packman](https://github.com/user/repository/raw/master/img/packman.png)

---

Packman is a fast static site generator, built for large sites with many files.

This is still a work in progress, and not yet ready for production.

Version 0.1.0.

---

    Usage: packman [options]

    Options:

      -h, --help             output usage information
      -V, --version          output the version number
      -d, --dev              development mode: serve content directly
      -b, --build            build mode: build a complete version, with packed assets
      -s, --server           start a server from the build directory
      -t, --target  <value>  specify a different target directory (default ./public)
      -f, --from    <value>  specify a different source directory (default ./content)
      -c, --config  <value>  specify a different config file (default ./config.js)
      -p, --port    <value>  specify a different server port (default 3000)
