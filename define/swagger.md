---
title: "Swagger (OpenAPI) 2.0 Definition"
layout: page
---

# Swagger (OpenAPI) 2.0

A [Swagger (OpenAPI) 2.0 definition](http://swagger.io/specification/) can be used in place of an [FSD file](/define/fsd) in any of the Facility command-line tools. A Swagger definition can also be generated from an FSD file.

## Purpose

Developers can choose to define their API in Swagger instead of FSD if they prefer the Swagger syntax or want to easily leverage [Swagger-compatible tools and code generators](http://swagger.io/tools/) as well as [Facility code generators](/generate).

Developers that prefer the FSD syntax can generate Swagger from their FSD to leverage [Swagger-compatible tools and code generators](http://swagger.io/tools/) if they prefer them or for languages and platforms not supported by the [Facility code generators](/generate).

Developers that already have a Swagger definition but want to switch to using an FSD can generate an FSD from the Swagger definition.

## Support

Facility command-line tools support both JSON and YAML formats for a Swagger definition file.

Not every feature in Swagger is supported. Also, Facility API information without a corresponding Swagger field is stored in an extension field (starts with `x-`).

Facility command-line tools do not currently support `$ref` fields that reference separate files.

The [`fsdgenfsd`](/define#fsdgenfsd) tool can be used to generate a Swagger definition from an FSD and vice versa.

## Swagger Data Types

The following table describes how each Swagger `type` and optional `format` map to an [FSD field type](/define/fsd#fields).

| Swagger `type` / `format` | FSD Type |
| --- | --- | --- |
| `boolean` | `boolean` |
| `integer` | `int32` |
| `integer` / `int32` | `int32` |
| `integer` / `int64` | `int64` |
| `number` | `double` |
| `number` / `float` | `double` |
| `number` / `double` | `double` |
| `string` | `string` |
| `string` / `byte` | `bytes` |
| `string` / `binary` | `string` |
| `string` / `date` | `string` |
| `string` / `date-time` | `string` |
| `string` / `password` | `string` |
| `file` |  (not supported) |

## Swagger Schema

### Swagger Object

| Field Name | FSD Equivalent |
| --- | --- |
| `swagger` | (always `2.0`) |
| `info` | (see [Info Object](#info-object)) |
| `host` | `[http(url: "(scheme)://(host)/(basePath)")]` on [service](/define/fsd#service) |
| `basePath` | `[http(url: "(scheme)://(host)/(basePath)")]` on [service](/define/fsd#service) |
| `schemes` | `[http(url: "(scheme)://(host)/(basePath)")]` on [service](/define/fsd#service) |
| `consumes` | (ignored) |
| `produces` | (ignored) |
| `paths` | (see [Path Object](#path-object)) |
| `definitions` | (see [Definition  Object](#definition-object)) |
| `parameters` | (see [Parameter  Object](#parameter-object)) |
| `responses` | (see [Response  Object](#response-object)) |
| `securityDefinitions` | (ignored) |
| `security` | (ignored) |
| `tags` | (ignored) |
| `externalDocs` | (ignored) |

Only one scheme is supported by FSD. `https` is preferred over `http`.

### Info Object

| Field Name | FSD Equivalent |
| --- | --- |
| `title` | [service](/define/fsd#service) summary |
| `description` | [service](/define/fsd#service) remarks |
| `termsOfService` | (ignored) |
| `contact` | (ignored) |
| `license` | (ignored) |
| `version` | `[info(version: (version))]` on [service](/define/fsd#service) |
| `x-identifier` | [service](/define/fsd#service) name |
| `x-codegen` | (set by `fsdgenfsd --swagger`) |

If the service name is not specified by `x-identifier` or the `--serviceName` command-line option, the `title` is used.
