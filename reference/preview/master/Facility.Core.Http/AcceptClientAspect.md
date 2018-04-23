# AcceptClientAspect class

Sets the Accept header of the request.

```csharp
public sealed class AcceptClientAspect : HttpClientServiceAspect
```

## Public Members

| name | description |
| --- | --- |
| static [Create](AcceptClientAspect/Create.md)(…) | Creates an aspect that sets the Accept header to the specified string. |

## Protected Members

| name | description |
| --- | --- |
| override [RequestReadyAsyncCore](AcceptClientAspect/RequestReadyAsyncCore.md)(…) | Called right before the request is sent. |

## See Also

* class [HttpClientServiceAspect](HttpClientServiceAspect.md)
* namespace [Facility.Core.Http](../Facility.Core.md)
* [AcceptClientAspect.cs](https://github.com/FacilityApi/FacilityCSharp/tree/master/src/Facility.Core/Http/AcceptClientAspect.cs)

<!-- DO NOT EDIT: generated by xmldocmd for Facility.Core.dll -->