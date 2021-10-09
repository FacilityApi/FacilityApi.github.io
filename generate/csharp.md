# C# Support

Facility supports tools and libraries for using [C# (.NET)](https://www.microsoft.com/net) with Facility Service Definitions.

## Tools

Generate C# for your [Facility Service Definition](/define/fsd) by doing one of the following:

* Use the [Facility Editor](/editor). Enter an API definition in the left pane, choose the "C#" generator, review the generated files, and click Download.
* Run the [`fsdgencsharp`](#fsdgencsharp) tool on the command line or in a build script.
* Use the `Facility.CodeGen.CSharp` .NET library ([NuGet Package](https://www.nuget.org/packages/Facility.CodeGen.CSharp)) in your own build tool.

## fsdgencsharp

`fsdgencsharp` is a command-line tool that generates C# for a Facility Service Definition.

Install `fsdgencsharp` [as documented](/generate/tools#installation) from its [NuGet package](https://www.nuget.org/packages/fsdgencsharp/).

`fsdgencsharp` generates multiple C# files and supports the [standard command-line options](/generate/tools#options) as well as the following additional command-line options:

* `--namespace <name>`: Sets the namespace used by the generated C#.
* `--csproj`: Updates any .csproj files in the output directory. Specifically, it adds any missing `.g.cs` files and removes any `.g.cs` files no longer needed.
