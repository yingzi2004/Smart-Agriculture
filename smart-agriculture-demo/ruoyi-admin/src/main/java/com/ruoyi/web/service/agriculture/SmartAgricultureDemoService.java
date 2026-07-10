package com.ruoyi.web.service.agriculture;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

/**
 * 智慧农业 Demo 数据服务。
 * 这里先放模拟数据，作为前后端联调骨架。
 * 后续可以拆成 service + mapper + domain，并改为 MySQL 查询。
 */
@Service
public class SmartAgricultureDemoService
{
    public Map<String, Object> health()
    {
        return mapOf("status", "UP", "project", "基于 LangChain 的智慧农业大棚", "stage", "frontend-backend-skeleton");
    }

    public Map<String, Object> dashboard()
    {
        return mapOf(
                "metrics", listOf(
                        mapOf("icon", "fa-home", "label", "智能大棚", "value", "4", "unit", "座", "trend", "GH-01 需要关注"),
                        mapOf("icon", "fa-microchip", "label", "在线设备", "value", "18", "unit", "台", "trend", "在线率 94%"),
                        mapOf("icon", "fa-magic", "label", "今日 AI 分析", "value", "32", "unit", "次", "trend", "LangChain Tool 调用 86 次"),
                        mapOf("icon", "fa-wrench", "label", "待处理工单", "value", "3", "unit", "条", "trend", "2 条由 AI 建议生成", "warn", true)),
                "agentStats", listOf(row("意图识别", "32"), row("Tool 调用", "86"), row("知识库检索", "24"), row("生成工单", "2")),
                "risks", listOf(row("GH-01", "重要", "土壤湿度连续 3 小时低于番茄结果期阈值"), row("GH-02", "一般", "草莓开花期湿度偏高，灰霉病风险上升"), row("GH-04", "一般", "光照不足且补光设备未及时响应")));
    }

    public Map<String, Object> greenhouses()
    {
        return mapOf("items", listOf(
                mapOf("code", "GH-01", "crop", "番茄", "stage", "结果期", "owner", "张同学", "status", "土壤偏低", "aiAdvice", "AI 建议补水"),
                mapOf("code", "GH-02", "crop", "草莓", "stage", "开花期", "owner", "李同学", "status", "湿度偏高", "aiAdvice", "AI 建议通风"),
                mapOf("code", "GH-03", "crop", "生菜", "stage", "生长期", "owner", "王同学", "status", "正常", "aiAdvice", "继续观察"),
                mapOf("code", "GH-04", "crop", "黄瓜", "stage", "苗期", "owner", "陈同学", "status", "光照不足", "aiAdvice", "AI 建议补光")));
    }

    public Map<String, Object> devices()
    {
        return mapOf("items", listOf(
                row("DEV-T-01", "GH-01", "温湿度传感器", "在线", "30 秒前", "26.8℃ / 68%"),
                row("DEV-S-01", "GH-01", "土壤湿度传感器", "在线", "35 秒前", "39%"),
                row("DEV-L-02", "GH-04", "光照传感器", "在线", "1 分钟前", "9.2 klux"),
                row("DEV-CAM-02", "GH-02", "虫情摄像头", "离线", "18 分钟前", "待检查")));
    }

    public Map<String, Object> cropBatches()
    {
        return mapOf("items", listOf(
                row("GH-01", "番茄", "结果期", "45%-65%", "22-30℃", "低于阈值"),
                row("GH-02", "草莓", "开花期", "50%-70%", "18-26℃", "湿度偏高"),
                row("GH-03", "生菜", "生长期", "55%-75%", "16-24℃", "正常"),
                row("GH-04", "黄瓜", "苗期", "50%-68%", "22-28℃", "光照不足")));
    }

    public Map<String, Object> environment()
    {
        return mapOf(
                "current", listOf(
                        mapOf("greenhouse", "GH-01", "temperature", "26.8℃", "airHumidity", "68%", "soilHumidity", "39%", "light", "18.6 klux", "status", "土壤偏低"),
                        mapOf("greenhouse", "GH-02", "temperature", "23.4℃", "airHumidity", "86%", "soilHumidity", "58%", "light", "14.2 klux", "status", "湿度偏高")),
                "toolUsage", listOf(
                        row("实时温湿度", "get_greenhouse_env", "判断是否异常"),
                        row("作物阶段", "get_crop_stage", "匹配适宜阈值"),
                        row("历史趋势", "get_env_history", "判断是否持续恶化"),
                        row("设备状态", "get_device_status", "判断数据是否可信")));
    }

    public Map<String, Object> langchain()
    {
        return mapOf(
                "question", "GH-01 番茄现在要不要浇水？",
                "answer", "建议生成“补充灌溉”工单。原因：GH-01 土壤湿度 39%，低于番茄结果期建议范围 45%-65%。",
                "tools", listOf(
                        row("get_greenhouse_env", "GH-01", "返回温度、湿度、土壤、光照"),
                        row("get_crop_stage", "番茄", "返回结果期和适宜阈值"),
                        row("search_agri_knowledge", "番茄 结果期 灌溉", "返回知识片段"),
                        row("create_work_order", "补充灌溉", "派发给负责人")),
                "workflow", Arrays.asList("环境异常", "Agent 分析", "RAG 查知识", "生成建议", "创建工单草稿", "记录 AI 日志"));
    }

    public Map<String, Object> knowledge()
    {
        return mapOf("items", listOf(
                row("作物知识", "番茄结果期土壤湿度建议 45%-65%", "灌溉建议"),
                row("病虫害防治", "草莓灰霉病高湿环境易发生", "风险解释"),
                row("设备说明", "土壤传感器异常值处理规则", "数据可信度判断"),
                row("项目规则", "重要告警需生成工单并通知负责人", "工作流决策")));
    }

    public Map<String, Object> workOrders()
    {
        return mapOf("items", listOf(
                row("WO-20260710-01", "GH-01", "补充灌溉", "AI 告警生成", "张同学", "待处理"),
                row("WO-20260710-02", "GH-02", "开窗通风", "湿度规则触发", "李同学", "处理中"),
                row("WO-20260710-03", "GH-04", "补光设备巡检", "设备数据异常", "陈同学", "待处理"),
                row("WO-20260709-06", "GH-03", "叶片拍照复核", "人工上报", "王同学", "已完成")));
    }

    public Map<String, Object> disease()
    {
        return mapOf(
                "diagnosis", listOf(row("疑似病害", "番茄早疫病"), row("置信度", "86%"), row("RAG 参考", "早疫病常在高湿、通风差环境下发生"), row("建议动作", "摘除病叶、加强通风、生成复核工单")),
                "records", listOf(row("10:30", "GH-01", "番茄", "早疫病风险", "生成复核工单"), row("昨日", "GH-02", "草莓", "灰霉病风险", "专家已回复")));
    }

    public Map<String, Object> trace()
    {
        return mapOf("batch", listOf(row("作物", "番茄"), row("大棚", "GH-01"), row("负责人", "张同学"), row("环境摘要", "结果期土壤湿度出现 1 次偏低"), row("工单记录", "补充灌溉 1 次，已闭环"), row("AI 摘要", "整体风险可控，建议继续观察土壤湿度")));
    }

    public Map<String, Object> community()
    {
        return mapOf("items", listOf(row("GH-02 草莓湿度高怎么处理？", "农户", "建议通风并观察灰霉病", "已入库"), row("番茄结果期多久浇一次水？", "农户", "结合土壤湿度，不固定天数", "待审核")));
    }

    public Map<String, Object> visualization()
    {
        return mapOf(
                "metrics", listOf(mapOf("label", "AI 调用", "value", "32", "unit", "次"), mapOf("label", "RAG 检索", "value", "24", "unit", "次"), mapOf("label", "工单闭环率", "value", "75", "unit", "%"), mapOf("label", "设备在线率", "value", "94", "unit", "%")),
                "langchainStats", listOf(row("Tool 调用", "86", "查询业务数据和创建工单"), row("RAG 检索", "24", "查询农业知识"), row("AI 日志", "32", "每次分析可追踪"), row("自动工单", "2", "AI 建议转执行")));
    }

    public Map<String, Object> analyze(Map<String, Object> request)
    {
        String question = request == null || request.get("question") == null ? "GH-01 番茄现在要不要浇水？" : String.valueOf(request.get("question"));
        return mapOf("question", question, "intent", "greenhouse_decision", "usedTools", Arrays.asList("get_greenhouse_env", "get_crop_stage", "search_agri_knowledge"), "answer", "Agent 已识别为种植决策问题。建议先查看大棚实时环境和作物阶段，再根据知识库阈值生成处理建议。", "nextAction", "必要时生成告警工单并派发给大棚负责人");
    }

    private List<Object> row(Object... values)
    {
        return new ArrayList<>(Arrays.asList(values));
    }

    private List<Object> listOf(Object... values)
    {
        return new ArrayList<>(Arrays.asList(values));
    }

    private Map<String, Object> mapOf(Object... values)
    {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int i = 0; i < values.length; i += 2)
        {
            map.put(String.valueOf(values[i]), values[i + 1]);
        }
        return map;
    }
}