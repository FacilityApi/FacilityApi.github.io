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

{: .table .table-striped .table-hover}
| Swagger type/format | FSD Type |
| --- | --- | --- |
| `boolean` | `boolean` |
| `integer` | `int32` |
| `integer`/`int32` | `int32` |
| `integer`/`int64` | `int64` |
| `number` | `double` |
| `number`/`float` | `double` |
| `number`/`double` | `double` |
| `string` | `string`, `enum` |
| `string`/`byte` | `bytes` |
| `string`/`binary` | `string` |
| `string`/`date` | `string` |
| `string`/`date-time` | `string` |
| `string`/`password` | `string` |
| `object` |  DTO, `error`, `result<T>`, `map<T>`, `object` |
| `array` |  `T[]` |
| `file` |  (not supported) |

## Swagger Schema

### Swagger Object

Defines the [service](/define/fsd#service).

{: .table .table-striped .table-hover}
| Field Name | FSD Equivalent |
| --- | --- |
| `swagger` | (always `2.0`) |
| `info` | (see [Info Object](#info-object)) |
| `host` | `[http(url: "(scheme)://(host)/(basePath)")]` on service |
| `basePath` | `[http(url: "(scheme)://(host)/(basePath)")]` on service |
| `schemes` | `[http(url: "(scheme)://(host)/(basePath)")]` on service |
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

Defines the [service](/define/fsd#service).

{: .table .table-striped .table-hover}
| Field Name | FSD Equivalent |
| --- | --- |
| `title` | service summary |
| `description` | service remarks |
| `termsOfService` | (ignored) |
| `contact` | (ignored) |
| `license` | (ignored) |
| `version` | `[info(version: (version))]` on service |
| `x-identifier` | service name |
| `x-codegen` | (set by `fsdgenfsd --swagger`) |

If the service name is not specified by `x-identifier` or the `--serviceName` command-line option, a service name is created from the `title`.

### Path Object

Defines a [method](/define/fsd#method).

{: .table .table-striped .table-hover}
| Field Name | FSD Equivalent |
| --- | --- |
| `/path` | `[http(path: "(path)")]` on method (see [Path Item Object](#path-item-object)) |

### Path Item Object

Defines a [method](/define/fsd#method).

{: .table .table-striped .table-hover}
| Field Name | FSD Equivalent |
| --- | --- |
| `$ref` | (supports internal references) |
| `get` | `[http(method: GET)]` on method (see [Operation Object](#operation-object)) |
| `put` | `[http(method: PUT)]` on method (see [Operation Object](#operation-object)) |
| `post` | `[http(method: POST)]` on method (see [Operation Object](#operation-object)) |
| `delete` | `[http(method: DELETE)]` on method (see [Operation Object](#operation-object)) |
| `options` | `[http(method: OPTIONS)]` on method (see [Operation Object](#operation-object)) |
| `head` | `[http(method: HEAD)]` on method (see [Operation Object](#operation-object)) |
| `patch` | `[http(method: PATCH)]` on method (see [Operation Object](#operation-object)) |
| `parameters` | (see [Parameter Object](#parameter-object)) |

### Operation Object

Defines a [method](/define/fsd#method).

{: .table .table-striped .table-hover}
| Field Name | FSD Equivalent |
| --- | --- |
| `tags` | (ignored) |
| `summary` | method summary |
| `description` | method remarks |
| `externalDocs` | (ignored) |
| `operationId` | method name |
| `consumes` | (`application/json` as appropriate) |
| `produces` | (`application/json` as appropriate) |
| `parameters` | (see [Parameter Object](#parameter-object)) |
| `responses` | (see [Responses Object](#responses-object)) |
| `schemes` | (ignored) |
| `deprecated` | `[obsolete]` on method |
| `security` | (ignored) |

If `operationId` is not specified, a method name is created from the HTTP method and path.

### Parameter Object

Defines a request [field](/define/fsd#field) and its type.

{: .table .table-striped .table-hover}
| Field Name | FSD Equivalent |
| --- | --- |
| `$ref` | (supports internal references) |
| `in` | `[http(from: (path|query|header|body))]` on field (`formData` not supported) |
| `name` | query, path, or header name |
| `description` | field summary |
| `required` | (`true` for path parameter; ignored otherwise) |
| `schema` | (see [Schema Object](#schema-object) |
| `type` | field type (see [Swagger Data Types](#swagger-data-types)) |
| `format` | field type (see [Swagger Data Types](#swagger-data-types)) |
| `allowEmptyValue` | (ignored) |
| `items` | array value type (see [Swagger Data Types](#swagger-data-types)) |
| `collectionFormat` | (ignored) |
| `default` | (ignored) |
| `maximum` | (ignored) |
| `exclusiveMaximum` | (ignored) |
| `minimum` | (ignored) |
| `exclusiveMinimum` | (ignored) |
| `maxLength` | (ignored) |
| `minLength` | (ignored) |
| `pattern` | (ignored) |
| `maxItems` | (ignored) |
| `minItems` | (ignored) |
| `uniqueItems` | (ignored) |
| `enum` | ([enum](/define/fsd#enumerated-types) values) |
| `multipleOf` | (ignored) |
| `x-identifier` | field name |
| `x-obsolete` | `[obsolete]` on field |

If `x-identifier` is not specified, the field name is set to the `name` field (or `"body"` for body fields).

### Responses Object

Defines response [fields](/define/fsd#field) of a [method](/define/fsd#method).

The field name corresponds to `[http(code: (code))]` on the entire method or the corresponding body field.

{: .table .table-striped .table-hover}
| Field Name | FSD Equivalent |
| --- | --- |
| `$ref` | (supports internal references) |
| `description` | body field summary |
| `schema` | response field(s) or body field (see [Schema Object](#schema-object) |
| `headers` | (ignored) |
| `examples` | (ignored) |
| `x-identifier` | body field name |

If `operationId` is not specified, a method name is created from the HTTP method and path.

### Schema Object

An items object, header object, or schema object. Defines a [DTO](/define/fsd#data-transfer-objects), a [field](/define/fsd#field), or a field type.

{: .table .table-striped .table-hover}
| Field Name | FSD Equivalent |
| --- | --- |
| `$ref` | (supports internal references) |
| `description` | field summary |
| `required` | (ignored) |
| `title` | (ignored) |
| `type` | field type (see [Swagger Data Types](#swagger-data-types)) |
| `format` | field type (see [Swagger Data Types](#swagger-data-types)) |
| `items` | array value type (see [Swagger Data Types](#swagger-data-types)) |
| `maxProperties` | (ignored) |
| `minProperties` | (ignored) |
| `default` | (ignored) |
| `maximum` | (ignored) |
| `exclusiveMaximum` | (ignored) |
| `minimum` | (ignored) |
| `exclusiveMinimum` | (ignored) |
| `maxLength` | (ignored) |
| `minLength` | (ignored) |
| `pattern` | (ignored) |
| `maxItems` | (ignored) |
| `minItems` | (ignored) |
| `uniqueItems` | (ignored) |
| `enum` | enum values |
| `multipleOf` | (ignored) |
| `properties` | DTO fields) |
| `allOf` | (ignored) |
| `additionalProperties` | map value type (see [Swagger Data Types](#swagger-data-types)) |
| `discriminator` | (ignored) |
| `readOnly` | (ignored) |
| `xml` | (ignored) |
| `externalDocs` | (ignored) |
| `example` | (ignored) |
| `x-identifier` | field name |
| `x-obsolete` | `[obsolete]` on field |
| `x-remarks` | DTO remarks |

If `x-identifier` is not specified, the field name is set to the `name` field (or `"body"` for body fields).
