# Facility.Definition assembly

## Facility.Definition namespace

| public type | description |
| --- | --- |
| interface [IServiceHasName](Facility.Definition/IServiceHasName.md) | A service element with a name. |
| interface [IServiceHasSummary](Facility.Definition/IServiceHasSummary.md) | A service element with a summary. |
| class [ServiceAttributeInfo](Facility.Definition/ServiceAttributeInfo.md) | A service attribute. |
| class [ServiceAttributeParameterInfo](Facility.Definition/ServiceAttributeParameterInfo.md) | An attribute parameter. |
| class [ServiceDefinitionError](Facility.Definition/ServiceDefinitionError.md) | An error while processing a service definition. |
| class [ServiceDefinitionException](Facility.Definition/ServiceDefinitionException.md) | Thrown when an error occurs while processing a service definition. |
| enum [ServiceDefinitionFormat](Facility.Definition/ServiceDefinitionFormat.md) | The format used by a service definition. |
| class [ServiceDefinitionPosition](Facility.Definition/ServiceDefinitionPosition.md) | A position in a service definition text. |
| class [ServiceDefinitionText](Facility.Definition/ServiceDefinitionText.md) | Named text containing a service definition. |
| static class [ServiceDefinitionUtility](Facility.Definition/ServiceDefinitionUtility.md) | Helper methods for working with service definitions. |
| class [ServiceDtoInfo](Facility.Definition/ServiceDtoInfo.md) | A service DTO. |
| abstract class [ServiceElementInfo](Facility.Definition/ServiceElementInfo.md) | Base class for service elements. |
| abstract class [ServiceElementWithAttributesInfo](Facility.Definition/ServiceElementWithAttributesInfo.md) | Properties common to service members with attributes. |
| class [ServiceEnumInfo](Facility.Definition/ServiceEnumInfo.md) | A service enumerated type. |
| class [ServiceEnumValueInfo](Facility.Definition/ServiceEnumValueInfo.md) | A value of an enumerated type. |
| class [ServiceErrorInfo](Facility.Definition/ServiceErrorInfo.md) | An error of an error set. |
| class [ServiceErrorSetInfo](Facility.Definition/ServiceErrorSetInfo.md) | An error set. |
| class [ServiceFieldInfo](Facility.Definition/ServiceFieldInfo.md) | A field of a DTO. |
| class [ServiceInfo](Facility.Definition/ServiceInfo.md) | Information about a service from a definition. |
| abstract class [ServiceMemberInfo](Facility.Definition/ServiceMemberInfo.md) | Properties common to service members. |
| class [ServiceMethodInfo](Facility.Definition/ServiceMethodInfo.md) | A service method. |
| class [ServicePart](Facility.Definition/ServicePart.md) | A part of a service element. |
| enum [ServicePartKind](Facility.Definition/ServicePartKind.md) | The kind of service part. |
| class [ServiceTypeInfo](Facility.Definition/ServiceTypeInfo.md) | A service type. |
| enum [ServiceTypeKind](Facility.Definition/ServiceTypeKind.md) | A kind of field type. |

## Facility.Definition.CodeGen namespace

| public type | description |
| --- | --- |
| abstract class [CodeGenerator](Facility.Definition.CodeGen/CodeGenerator.md) | Base class for code generators. |
| class [CodeGenFile](Facility.Definition.CodeGen/CodeGenFile.md) | A code-generated file. |
| class [CodeGenOutput](Facility.Definition.CodeGen/CodeGenOutput.md) | The output of a code generator. |
| class [CodeGenPattern](Facility.Definition.CodeGen/CodeGenPattern.md) | A pattern for generated output. |
| static class [CodeGenUtility](Facility.Definition.CodeGen/CodeGenUtility.md) | Helper methods for generating code. |
| class [CodeWriter](Facility.Definition.CodeGen/CodeWriter.md) | Helper class for generating code. |

## Facility.Definition.Fsd namespace

| public type | description |
| --- | --- |
| class [FsdGenerator](Facility.Definition.Fsd/FsdGenerator.md) | Generates an FSD file for a service definition. |
| class [FsdParser](Facility.Definition.Fsd/FsdParser.md) | Parses FSD files. |

## Facility.Definition.Http namespace

| public type | description |
| --- | --- |
| class [HttpBodyFieldInfo](Facility.Definition.Http/HttpBodyFieldInfo.md) | Information about a DTO field used as a request or response body. |
| abstract class [HttpElementInfo](Facility.Definition.Http/HttpElementInfo.md) | Base class for HTTP service elements. |
| class [HttpErrorInfo](Facility.Definition.Http/HttpErrorInfo.md) | The HTTP mapping of an error. |
| class [HttpErrorSetInfo](Facility.Definition.Http/HttpErrorSetInfo.md) | The HTTP mapping of an error set. |
| class [HttpHeaderFieldInfo](Facility.Definition.Http/HttpHeaderFieldInfo.md) | Information about a field that corresponds to a request or response HTTP header. |
| class [HttpMethodInfo](Facility.Definition.Http/HttpMethodInfo.md) | The HTTP mapping for a service method. |
| class [HttpNormalFieldInfo](Facility.Definition.Http/HttpNormalFieldInfo.md) | Information about a normal request or response field. |
| class [HttpPathFieldInfo](Facility.Definition.Http/HttpPathFieldInfo.md) | Information about a field that corresponds to a request path parameter. |
| class [HttpQueryFieldInfo](Facility.Definition.Http/HttpQueryFieldInfo.md) | Information about a field that corresponds to a request query parameter. |
| class [HttpResponseInfo](Facility.Definition.Http/HttpResponseInfo.md) | Information about a valid method response. |
| class [HttpServiceInfo](Facility.Definition.Http/HttpServiceInfo.md) | The HTTP mapping for a service. |

## Facility.Definition.Swagger namespace

| public type | description |
| --- | --- |
| interface [ISwaggerSchema](Facility.Definition.Swagger/ISwaggerSchema.md) |  |
| class [SwaggerContact](Facility.Definition.Swagger/SwaggerContact.md) |  |
| class [SwaggerExternalDocumentation](Facility.Definition.Swagger/SwaggerExternalDocumentation.md) |  |
| class [SwaggerGenerator](Facility.Definition.Swagger/SwaggerGenerator.md) | Generates a Swagger (OpenAPI) 2.0 file for a service definition. |
| class [SwaggerInfo](Facility.Definition.Swagger/SwaggerInfo.md) |  |
| class [SwaggerLicense](Facility.Definition.Swagger/SwaggerLicense.md) |  |
| class [SwaggerOperation](Facility.Definition.Swagger/SwaggerOperation.md) |  |
| class [SwaggerOperations](Facility.Definition.Swagger/SwaggerOperations.md) |  |
| class [SwaggerParameter](Facility.Definition.Swagger/SwaggerParameter.md) |  |
| static class [SwaggerParameterKind](Facility.Definition.Swagger/SwaggerParameterKind.md) |  |
| class [SwaggerParser](Facility.Definition.Swagger/SwaggerParser.md) | Parses Swagger (OpenAPI) 2.0. |
| class [SwaggerResponse](Facility.Definition.Swagger/SwaggerResponse.md) |  |
| class [SwaggerSchema](Facility.Definition.Swagger/SwaggerSchema.md) |  |
| static class [SwaggerSchemaType](Facility.Definition.Swagger/SwaggerSchemaType.md) |  |
| static class [SwaggerSchemaTypeFormat](Facility.Definition.Swagger/SwaggerSchemaTypeFormat.md) |  |
| static class [SwaggerScheme](Facility.Definition.Swagger/SwaggerScheme.md) |  |
| class [SwaggerSecurityScheme](Facility.Definition.Swagger/SwaggerSecurityScheme.md) |  |
| class [SwaggerService](Facility.Definition.Swagger/SwaggerService.md) |  |
| class [SwaggerTag](Facility.Definition.Swagger/SwaggerTag.md) |  |
| static class [SwaggerUtility](Facility.Definition.Swagger/SwaggerUtility.md) | Helpers for Swagger (OpenAPI) 2.0. |

<!-- DO NOT EDIT: generated by xmldocmd for Facility.Definition.dll -->
