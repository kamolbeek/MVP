using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XalqUchun.API.DTOs.Common;
using XalqUchun.API.DTOs.Master;
using XalqUchun.API.Services.Interfaces;

namespace XalqUchun.API.Controllers;

[Route("api/search")]
[ApiController]
public class SearchController : ControllerBase
{
    private readonly IMasterService _masterService;

    public SearchController(IMasterService masterService)
    {
        _masterService = masterService;
    }

    [HttpGet("masters")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<PagedResult<MasterListItemDto>>>> SearchMasters([FromQuery] SearchMastersDto filters)
    {
        var result = await _masterService.GetMastersAsync(filters);
        return Ok(result);
    }
}
