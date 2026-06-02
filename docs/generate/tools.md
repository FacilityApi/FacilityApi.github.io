# Command-Line Tools

Facility supports command-line tools for generating code from [Facility Service Definitions](/define/fsd). The supported tools generate client code, server code, and documentation for different programming languages and frameworks. They can also be used to convert a definition from one format to another.

## Installation

Facility command-line tools are [.NET tools](https://docs.microsoft.com/en-us/dotnet/core/tools/global-tools) that can be installed globally or locally.

## Usage

Each Facility command-line tool accepts the path to the input file, the path to the output file or directory, and a number of options.

If the input path is `-`, it is read from standard input. Otherwise it must be the path of a file. Either way, the input must be a [supported Facility Service Definition](/define/fsd).

If the command-line tool generates multiple files, the output path must be a path to the output directory, which will be created if necessary.

If the command-line tool generates a single file, the output path can be a file or a directory. If it does not exist, it must end in a path separator (slash or backslash) to be considered a directory. If the output path is `-`, the file is written to standard output.

Note that existing output files are only overwritten if the tool generates different content for that file.

If the definition changes in such a way that previously generated files are no longer used, the tool will delete the unused file if the `--clean` option is used (see below).

## Options

Facility command-line tools support the following standard command-line options:

* `--clean`: If the tool generates multiple files, use this option to delete previously generated files that are no longer used.
* `--indent (tab|1|2|3|4|5|6|7|8)`: Indicates the type of indent that should be used, i.e. a tab or the specified number of spaces. Different tools have different defaults.
* `--newline (auto|lf|crlf)`: Indicates the newline used in the output. Usually defaults to `auto`, which uses CRLF or LF, depending on the platform.
* `--dry-run`: Executes the tool without making changes to the file system.
* `--verify`: Executes the tool without making changes to the file system, but exits with error code 1 if changes would be made. Typically used in build scripts to ensure that any changes to the FSD are already reflected in the generated code.
* `--quiet`: Suppresses normal console output.

For example, `fsdgenfsd myapi.fsd canon\ --indent 2` generates a "canonical" FSD for the specified FSD in the `canon` directory, using two spaces for each indent.
