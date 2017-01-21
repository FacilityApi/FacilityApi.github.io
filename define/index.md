# Define API

You can describe the operations of an API in one of the supported API definition languages:

* [Facility Service Definition (FSD)](/define/fsd)
* [Swagger (OpenAPI) 2.0](/define/swagger)

## Conversion

API definitions can be converted between formats by doing one of the following:

* Use the [Facility Editor](/editor). Enter an FSD or Swagger API definition in the left pane, choose the "Swagger" or "FSD" generator, and copy the generated definition from the right pane (or click Download).
* Run the `fsdgenfsd` tool (see below) on the command line or in a build script.
* Use the `Facility.Definition` .NET library ([NuGet Package](https://www.nuget.org/packages/Facility.Definition)) in your own build tool.

## fsdgenfsd

`fsdgenfsd` is used to convert a service definition between the supported API definition languages. It can also be used to "normalize" an API definition by "converting" it to the same format.

Install `fsdgenfsd` [as documented](/generate/tools#installation) from its [NuGet package](https://www.nuget.org/packages/fsdgenfsd/).

`fsdgenfsd` generates a single file and supports the [standard command-line options](/generate/tools#options) as well as the following additional command-line options:

* `--swagger`: Generates Swagger (OpenAPI) 2.0. If omitted, the tool generates FSD.
* `--yaml`: When used with `--swagger`, generates YAML instead of JSON.
