package com.ruoyi.web.controller.agriculture;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ruoyi.common.annotation.Anonymous;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.web.service.agriculture.SmartAgricultureDemoService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

/**
 * 智慧农业大棚 Demo API。
 * 当前阶段提供前后端联调用的接口骨架和模拟数据。
 */
@Api(tags = "智慧农业大棚 Demo API")
@Anonymous
@RestController
@RequestMapping(value = "/agriculture/api", produces = "application/json;charset=UTF-8")
public class SmartAgricultureApiController
{
    @Autowired
    private SmartAgricultureDemoService demoService;

    @ApiOperation("健康检查")
    @GetMapping("/health")
    public AjaxResult health()
    {
        return AjaxResult.success(demoService.health());
    }

    @ApiOperation("Branch test")
    @GetMapping("/branch-test")
    public AjaxResult branchTest()
    {
        return AjaxResult.success(demoService.branchTest());
    }

    @ApiOperation("智能总览")
    @GetMapping("/dashboard")
    public AjaxResult dashboard()
    {
        return AjaxResult.success(demoService.dashboard());
    }

    @ApiOperation("大棚管理")
    @GetMapping("/greenhouses")
    public AjaxResult greenhouses()
    {
        return AjaxResult.success(demoService.greenhouses());
    }

    @ApiOperation("设备监测")
    @GetMapping("/devices")
    public AjaxResult devices()
    {
        return AjaxResult.success(demoService.devices());
    }

    @ApiOperation("作物批次")
    @GetMapping("/crop-batches")
    public AjaxResult cropBatches()
    {
        return AjaxResult.success(demoService.cropBatches());
    }

    @ApiOperation("环境监测")
    @GetMapping("/environment")
    public AjaxResult environment()
    {
        return AjaxResult.success(demoService.environment());
    }

    @ApiOperation("LangChain 中枢")
    @GetMapping("/langchain")
    public AjaxResult langchain()
    {
        return AjaxResult.success(demoService.langchain());
    }

    @ApiOperation("农业知识库")
    @GetMapping("/knowledge")
    public AjaxResult knowledge()
    {
        return AjaxResult.success(demoService.knowledge());
    }

    @ApiOperation("告警工单")
    @GetMapping("/work-orders")
    public AjaxResult workOrders()
    {
        return AjaxResult.success(demoService.workOrders());
    }

    @ApiOperation("病虫害诊断")
    @GetMapping("/disease")
    public AjaxResult disease()
    {
        return AjaxResult.success(demoService.disease());
    }

    @ApiOperation("溯源管理")
    @GetMapping("/trace")
    public AjaxResult trace()
    {
        return AjaxResult.success(demoService.trace());
    }

    @ApiOperation("社区共创")
    @GetMapping("/community")
    public AjaxResult community()
    {
        return AjaxResult.success(demoService.community());
    }

    @ApiOperation("数据大屏")
    @GetMapping("/visualization")
    public AjaxResult visualization()
    {
        return AjaxResult.success(demoService.visualization());
    }

    @ApiOperation("模拟 LangChain 分析")
    @PostMapping("/langchain/analyze")
    public AjaxResult analyze(@RequestBody(required = false) Map<String, Object> request)
    {
        return AjaxResult.success(demoService.analyze(request));
    }
}
