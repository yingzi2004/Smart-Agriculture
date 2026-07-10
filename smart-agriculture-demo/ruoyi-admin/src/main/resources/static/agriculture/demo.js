(function () {
    var page = document.body.getAttribute("data-page");
    var app = document.getElementById("app");

    var state = {
        metrics: [
            { icon: "fa-home", label: "智能大棚", value: "4", unit: "座", trend: "GH-01 需要关注" },
            { icon: "fa-microchip", label: "在线设备", value: "18", unit: "台", trend: "在线率 94%" },
            { icon: "fa-magic", label: "今日 AI 分析", value: "32", unit: "次", trend: "LangChain Tool 调用 86 次" },
            { icon: "fa-wrench", label: "待处理工单", value: "3", unit: "条", trend: "2 条由 AI 建议生成", warn: true }
        ],
        greenhouses: [
            ["GH-01", "番茄", "结果期", "张同学", "土壤偏低", "AI 建议补水"],
            ["GH-02", "草莓", "开花期", "李同学", "湿度偏高", "AI 建议通风"],
            ["GH-03", "生菜", "生长期", "王同学", "正常", "继续观察"],
            ["GH-04", "黄瓜", "苗期", "陈同学", "光照不足", "AI 建议补光"]
        ],
        devices: [
            ["DEV-T-01", "GH-01", "温湿度传感器", "在线", "30 秒前", "26.8℃ / 68%"],
            ["DEV-S-01", "GH-01", "土壤湿度传感器", "在线", "35 秒前", "39%"],
            ["DEV-L-02", "GH-04", "光照传感器", "在线", "1 分钟前", "9.2 klux"],
            ["DEV-CAM-02", "GH-02", "虫情摄像头", "离线", "18 分钟前", "待检查"]
        ],
        workOrders: [
            ["WO-20260710-01", "GH-01", "补充灌溉", "AI 告警生成", "张同学", "待处理"],
            ["WO-20260710-02", "GH-02", "开窗通风", "湿度规则触发", "李同学", "处理中"],
            ["WO-20260710-03", "GH-04", "补光设备巡检", "设备数据异常", "陈同学", "待处理"],
            ["WO-20260709-06", "GH-03", "叶片拍照复核", "人工上报", "王同学", "已完成"]
        ],
        tools: [
            ["get_greenhouse_env", "查询大棚实时环境", "GH-01", "返回温度、湿度、土壤、光照"],
            ["get_crop_stage", "查询作物阶段", "番茄", "返回结果期和适宜阈值"],
            ["search_agri_knowledge", "检索农业知识库", "番茄 结果期 灌溉", "返回知识片段"],
            ["create_work_order", "生成处理工单", "补充灌溉", "派发给负责人"]
        ]
    };

    function header(title, desc, actions) {
        return '<div class="ag-header"><div class="ag-title"><h2>' + title + '</h2><p>' + desc + '</p></div><div class="ag-actions">' + (actions || "") + '</div></div>';
    }

    function card(title, body, extra) {
        return '<div class="ag-card ' + (extra || "") + '"><div class="ag-card-title"><span>' + title + '</span></div>' + body + '</div>';
    }

    function metricCard(item) {
        return '<div class="ag-card"><div class="metric"><div><span class="value">' + item.value + '<small>' + item.unit + '</small></span><span class="label">' + item.label + '</span><span class="trend ' + (item.warn ? "warn" : "") + '">' + item.trend + '</span></div><i class="fa ' + item.icon + '"></i></div></div>';
    }

    function tag(text, type) {
        return '<span class="tag ' + (type || "") + '">' + text + '</span>';
    }

    function progress(value) {
        return '<div class="progress-line"><span style="width:' + value + '%"></span></div>';
    }

    function table(headers, rows) {
        return '<table class="ag-table"><thead><tr>' + headers.map(function (h) { return '<th>' + h + '</th>'; }).join("") + '</tr></thead><tbody>' + rows.map(function (row) {
            return '<tr>' + row.map(function (cell) { return '<td>' + cell + '</td>'; }).join("") + '</tr>';
        }).join("") + '</tbody></table>';
    }

    function renderDashboard() {
        app.innerHTML = header("智能总览", "不是普通后台首页，重点展示 LangChain 如何把大棚数据转成决策和工单。", '<button class="ag-btn primary"><i class="fa fa-play"></i> 演示 AI 分析链路</button>') +
            '<div class="ag-grid">' +
            state.metrics.map(function (m) { return '<div class="ag-col-3">' + metricCard(m) + '</div>'; }).join("") +
            '<div class="ag-col-8">' + card('AI 决策链路', '<div class="flow"><span>用户问题/环境告警</span><i class="fa fa-arrow-right"></i><span>Agent 判断意图</span><i class="fa fa-arrow-right"></i><span>Tool 查数据</span><i class="fa fa-arrow-right"></i><span>RAG 查知识</span><i class="fa fa-arrow-right"></i><span>生成建议/工单</span></div><div id="envChart" class="chart small"></div>') + '</div>' +
            '<div class="ag-col-4">' + card('今日 Agent 运行', table(["环节", "次数"], [["意图识别", "32"], ["Tool 调用", "86"], ["知识库检索", "24"], ["生成工单", "2"]])) + '</div>' +
            '<div class="ag-col-7">' + card('大棚风险排行', table(["大棚", "风险", "AI 解释"], [["GH-01", tag("重要", "warn"), "土壤湿度连续 3 小时低于番茄结果期阈值"], ["GH-02", tag("一般", "info"), "草莓开花期湿度偏高，灰霉病风险上升"], ["GH-04", tag("一般", "info"), "光照不足且补光设备未及时响应"]])) + '</div>' +
            '<div class="ag-col-5">' + card('待处理工单', renderWorkOrderMini()) + '</div>' +
            '</div>';
        drawEnvChart("envChart");
    }

    function renderGreenhouses() {
        app.innerHTML = header("大棚管理", "管理大棚档案、负责人、当前作物和 AI 关注点。", '<button class="ag-btn primary"><i class="fa fa-plus"></i> 新增大棚</button>') +
            '<div class="ag-grid">' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-home", label: "大棚数量", value: "4", unit: "座", trend: "演示基地" }) + '</div>' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-user", label: "负责人", value: "4", unit: "人", trend: "一棚一人" }) + '</div>' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-exclamation-circle", label: "AI 关注", value: "3", unit: "项", trend: "需要处理", warn: true }) + '</div>' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-check", label: "运行正常", value: "1", unit: "座", trend: "GH-03" }) + '</div>' +
            '<div class="ag-col-12">' + card('大棚档案', table(["编号", "当前作物", "阶段", "负责人", "状态", "AI 关注点"], state.greenhouses.map(function (g) { return [g[0], g[1], g[2], g[3], g[4].indexOf("正常") >= 0 ? tag(g[4], "ok") : tag(g[4], "warn"), g[5]]; }))) + '</div>' +
            '</div>';
    }

    function renderDevices() {
        app.innerHTML = header("设备监测", "展示传感器和摄像头状态，给 LangChain Tool 提供可信数据来源。", '<button class="ag-btn warning"><i class="fa fa-refresh"></i> 同步设备</button>') +
            '<div class="ag-grid">' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-microchip", label: "设备总数", value: "19", unit: "台", trend: "4 类设备" }) + '</div>' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-wifi", label: "在线设备", value: "18", unit: "台", trend: "在线率 94%" }) + '</div>' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-camera", label: "视觉设备", value: "4", unit: "台", trend: "病虫害识别入口" }) + '</div>' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-warning", label: "异常设备", value: "1", unit: "台", trend: "虫情摄像头离线", warn: true }) + '</div>' +
            '<div class="ag-col-12">' + card('设备列表', table(["设备编号", "所属大棚", "设备类型", "状态", "最后上报", "最新数据"], state.devices.map(function (d) { return [d[0], d[1], d[2], d[3] === "在线" ? tag(d[3], "ok") : tag(d[3], "danger"), d[4], d[5]]; }))) + '</div>' +
            '</div>';
    }

    function renderCrops() {
        app.innerHTML = header("作物批次", "管理作物、批次和生长阶段，AI 判断必须依赖这些上下文。", '<button class="ag-btn primary"><i class="fa fa-plus"></i> 新增批次</button>') +
            '<div class="ag-grid">' +
            '<div class="ag-col-4">' + metricCard({ icon: "fa-leaf", label: "作物类型", value: "4", unit: "种", trend: "番茄/草莓/生菜/黄瓜" }) + '</div>' +
            '<div class="ag-col-4">' + metricCard({ icon: "fa-calendar", label: "活跃批次", value: "4", unit: "批", trend: "全部在管" }) + '</div>' +
            '<div class="ag-col-4">' + metricCard({ icon: "fa-magic", label: "AI 阈值匹配", value: "4", unit: "套", trend: "按作物阶段匹配" }) + '</div>' +
            '<div class="ag-col-12">' + card('批次与阈值', table(["大棚", "作物", "阶段", "建议土壤湿度", "建议温度", "AI 判断"], [["GH-01", "番茄", "结果期", "45%-65%", "22-30℃", tag("低于阈值", "warn")], ["GH-02", "草莓", "开花期", "50%-70%", "18-26℃", tag("湿度偏高", "warn")], ["GH-03", "生菜", "生长期", "55%-75%", "16-24℃", tag("正常", "ok")], ["GH-04", "黄瓜", "苗期", "50%-68%", "22-28℃", tag("光照不足", "info")]])) + '</div>' +
            '</div>';
    }

    function renderEnvironment() {
        app.innerHTML = header("环境监测", "环境数据不是只展示曲线，而是作为 Agent 调用 Tool 时的实时依据。", '<button class="ag-btn warning"><i class="fa fa-bolt"></i> 模拟异常</button>') +
            '<div class="ag-grid">' +
            state.metrics.slice(0, 2).map(function (m) { return '<div class="ag-col-3">' + metricCard(m) + '</div>'; }).join("") +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-tint", label: "GH-01 土壤", value: "39", unit: "%", trend: "低于番茄阈值", warn: true }) + '</div>' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-sun-o", label: "GH-04 光照", value: "9.2", unit: "klux", trend: "建议补光", warn: true }) + '</div>' +
            '<div class="ag-col-8">' + card('环境趋势', '<div id="envMainChart" class="chart"></div>') + '</div>' +
            '<div class="ag-col-4">' + card('适宜度评分', '<div id="fitChart" class="chart"></div>') + '</div>' +
            '<div class="ag-col-12">' + card('采集数据进入 AI 的方式', table(["数据", "Tool", "AI 用途"], [["实时温湿度", "get_greenhouse_env", "判断是否异常"], ["作物阶段", "get_crop_stage", "匹配适宜阈值"], ["历史趋势", "get_env_history", "判断是否持续恶化"], ["设备状态", "get_device_status", "判断数据是否可信"]])) + '</div>' +
            '</div>';
        drawEnvChart("envMainChart");
        drawFitChart("fitChart");
    }

    function renderAi() {
        app.innerHTML = header("LangChain 中枢", "本项目的核心亮点：Agent + Tool + RAG + Memory + Workflow。", '<button class="ag-btn primary" id="sendChat"><i class="fa fa-play"></i> 运行示例</button>') +
            '<div class="ag-grid">' +
            '<div class="ag-col-7">' + card('Agent 演示问答', '<div class="chat-box" id="chatBox"><div class="chat-msg user">GH-01 番茄现在要不要浇水？</div><div class="chat-msg bot">Agent 判断：这是灌溉决策问题。已调用 get_greenhouse_env、get_crop_stage、search_agri_knowledge。结论：建议生成“补充灌溉”工单，原因是 GH-01 土壤湿度 39%，低于番茄结果期建议范围 45%-65%。</div></div><div class="chat-input"><input id="chatInput" value="GH-02 草莓湿度偏高怎么处理？"><button class="ag-btn primary" id="askBtn">发送</button></div>') + '</div>' +
            '<div class="ag-col-5">' + card('Tool 调用轨迹', table(["Tool", "输入", "输出"], state.tools.map(function (t) { return [t[0], t[2], t[3]]; }))) + '</div>' +
            '<div class="ag-col-6">' + card('Agent 设计', table(["组件", "作用"], [["Planner", "判断问题类型和需要的数据"], ["Tool Executor", "调用业务接口查询数据"], ["Memory", "记住当前大棚和对话上下文"], ["Answer Writer", "输出原因、建议和可执行动作"]])) + '</div>' +
            '<div class="ag-col-6">' + card('Workflow 设计', '<div class="flow vertical"><span>环境异常</span><span>Agent 分析</span><span>RAG 查知识</span><span>生成建议</span><span>创建工单草稿</span><span>记录 AI 日志</span></div>') + '</div>' +
            '</div>';
        document.getElementById("askBtn").onclick = sendChat;
        document.getElementById("sendChat").onclick = sendChat;
    }

    function renderKnowledge() {
        app.innerHTML = header("农业知识库", "RAG 的数据来源：作物知识、病虫害防治、设备说明和项目规则。", '<button class="ag-btn primary"><i class="fa fa-upload"></i> 导入知识</button>') +
            '<div class="ag-grid">' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-file-text", label: "知识文档", value: "42", unit: "篇", trend: "已切分 386 个片段" }) + '</div>' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-search", label: "今日检索", value: "24", unit: "次", trend: "命中率 91%" }) + '</div>' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-leaf", label: "作物规则", value: "16", unit: "条", trend: "用于阈值判断" }) + '</div>' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-bug", label: "病虫害条目", value: "18", unit: "条", trend: "用于诊断建议" }) + '</div>' +
            '<div class="ag-col-12">' + card('知识库内容', table(["类型", "示例内容", "AI 用途"], [["作物知识", "番茄结果期土壤湿度建议 45%-65%", "灌溉建议"], ["病虫害防治", "草莓灰霉病高湿环境易发生", "风险解释"], ["设备说明", "土壤传感器异常值处理规则", "数据可信度判断"], ["项目规则", "重要告警需生成工单并通知负责人", "工作流决策"]])) + '</div>' +
            '</div>';
    }

    function renderAlarms() {
        app.innerHTML = header("告警工单", "原“农事任务”改成工单闭环：AI/规则发现问题后，派给人处理。", '<button class="ag-btn primary"><i class="fa fa-plus"></i> 新建工单</button>') +
            '<div class="ag-grid">' +
            '<div class="ag-col-4">' + metricCard({ icon: "fa-warning", label: "待处理", value: "2", unit: "条", trend: "需要农户执行", warn: true }) + '</div>' +
            '<div class="ag-col-4">' + metricCard({ icon: "fa-cogs", label: "AI 生成", value: "2", unit: "条", trend: "由 Agent 建议" }) + '</div>' +
            '<div class="ag-col-4">' + metricCard({ icon: "fa-check", label: "今日闭环", value: "1", unit: "条", trend: "完成后关闭告警" }) + '</div>' +
            '<div class="ag-col-12">' + card('工单列表', table(["工单号", "大棚", "处理动作", "来源", "负责人", "状态"], state.workOrders.map(function (w) { var cls = w[5] === "已完成" ? "ok" : (w[5] === "处理中" ? "warn" : "danger"); return [w[0], w[1], w[2], w[3], w[4], tag(w[5], cls)]; }))) + '</div>' +
            '<div class="ag-col-12">' + card('为什么需要工单？', '<p>环境监测只知道“发生了什么”，LangChain 分析能解释“为什么”，但最终还需要人去浇水、通风、检查设备、上传复核照片。工单就是把 AI 建议落到真实执行的闭环。</p>') + '</div>' +
            '</div>';
    }

    function renderDisease() {
        app.innerHTML = header("病虫害诊断", "图片识别 + RAG 防治知识 + 工单生成。", '<button class="ag-btn primary"><i class="fa fa-upload"></i> 上传叶片图片</button>') +
            '<div class="ag-grid">' +
            '<div class="ag-col-5">' + card('图片识别', '<div class="upload-box"><i class="fa fa-bug fa-2x"></i><p>上传叶片/果实图片</p><input type="file" id="leafInput" accept="image/*"><div id="imagePreview"></div></div>') + '</div>' +
            '<div class="ag-col-7">' + card('AI 诊断结果', table(["项目", "结果"], [["疑似病害", "番茄早疫病"], ["置信度", "86%"], ["RAG 参考", "早疫病常在高湿、通风差环境下发生"], ["建议动作", "摘除病叶、加强通风、生成复核工单"]])) + '</div>' +
            '<div class="ag-col-12">' + card('诊断记录', table(["时间", "大棚", "作物", "识别结果", "后续动作"], [["10:30", "GH-01", "番茄", tag("早疫病风险", "warn"), "生成复核工单"], ["昨日", "GH-02", "草莓", tag("灰霉病风险", "warn"), "专家已回复"]])) + '</div>' +
            '</div>';
        document.getElementById("leafInput").onchange = previewLeaf;
    }

    function renderTrace() {
        app.innerHTML = header("溯源管理", "把批次、环境、工单和病虫害记录汇总成可扫码查看的生产档案。", '<button class="ag-btn primary"><i class="fa fa-qrcode"></i> 生成溯源码</button>') +
            '<div class="trace-layout">' +
            card('批次二维码', '<div class="qr">' + fakeQr() + '</div><p style="margin-top:10px;">SA-GH01-TOMATO-202607</p>') +
            card('溯源档案', table(["项目", "内容"], [["作物", "番茄"], ["大棚", "GH-01"], ["负责人", "张同学"], ["环境摘要", "结果期土壤湿度出现 1 次偏低"], ["工单记录", "补充灌溉 1 次，已闭环"], ["AI 摘要", "整体风险可控，建议继续观察土壤湿度"]])) +
            '</div>';
    }

    function renderCommunity() {
        app.innerHTML = header("社区共创", "不是泛泛聊天区，主要沉淀种植问题、专家回复和可进入 RAG 的知识。", '<button class="ag-btn primary"><i class="fa fa-pencil"></i> 发布问题</button>') +
            '<div class="ag-grid">' +
            '<div class="ag-col-4">' + metricCard({ icon: "fa-comments", label: "问题帖", value: "36", unit: "条", trend: "9 条已转知识库" }) + '</div>' +
            '<div class="ag-col-4">' + metricCard({ icon: "fa-user-md", label: "专家答疑", value: "12", unit: "条", trend: "可沉淀 RAG" }) + '</div>' +
            '<div class="ag-col-4">' + metricCard({ icon: "fa-book", label: "知识沉淀", value: "9", unit: "条", trend: "审核后入库" }) + '</div>' +
            '<div class="ag-col-12">' + card('社区问题', table(["问题", "来源", "专家回复", "是否入库"], [["GH-02 草莓湿度高怎么处理？", "农户", "建议通风并观察灰霉病", tag("已入库", "ok")], ["番茄结果期多久浇一次水？", "农户", "结合土壤湿度，不固定天数", tag("待审核", "warn")]])) + '</div>' +
            '</div>';
    }

    function renderVisualization() {
        app.innerHTML = header("数据大屏", "用于汇报展示：体现 AI 调用、设备在线、风险分布和工单闭环。", '<button class="ag-btn primary"><i class="fa fa-desktop"></i> 全屏展示</button>') +
            '<div class="ag-grid">' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-magic", label: "AI 调用", value: "32", unit: "次", trend: "今日" }) + '</div>' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-search", label: "RAG 检索", value: "24", unit: "次", trend: "命中率 91%" }) + '</div>' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-wrench", label: "工单闭环率", value: "75", unit: "%", trend: "本周" }) + '</div>' +
            '<div class="ag-col-3">' + metricCard({ icon: "fa-wifi", label: "设备在线率", value: "94", unit: "%", trend: "1 台离线", warn: true }) + '</div>' +
            '<div class="ag-col-8">' + card('环境趋势', '<div id="visualEnvChart" class="chart"></div>') + '</div>' +
            '<div class="ag-col-4">' + card('作物结构', '<div id="visualCropChart" class="chart"></div>') + '</div>' +
            '<div class="ag-col-5">' + card('工单占比', '<div id="visualTaskChart" class="chart small"></div>') + '</div>' +
            '<div class="ag-col-7">' + card('LangChain 指标', table(["指标", "数值", "说明"], [["Tool 调用", "86", "查询业务数据和创建工单"], ["RAG 检索", "24", "查询农业知识"], ["AI 日志", "32", "每次分析可追踪"], ["自动工单", "2", "AI 建议转执行"]])) + '</div>' +
            '</div>';
        drawEnvChart("visualEnvChart");
        drawCropChart("visualCropChart");
        drawTaskChart("visualTaskChart");
    }

    function renderWorkOrderMini() {
        return state.workOrders.slice(0, 3).map(function (w) {
            return '<div class="timeline-item"><span class="time">' + w[1] + '</span><span>' + w[2] + '</span><span>' + tag(w[5], w[5] === "处理中" ? "warn" : "danger") + '</span></div>';
        }).join("");
    }

    function sendChat() {
        var input = document.getElementById("chatInput");
        var box = document.getElementById("chatBox");
        if (!box) return;
        var question = input ? input.value : "GH-01 番茄现在要不要浇水？";
        box.innerHTML += '<div class="chat-msg user">' + question + '</div>';
        box.innerHTML += '<div class="chat-msg bot">Agent 已识别为“种植决策问题”。调用 Tool：get_greenhouse_env、get_crop_stage、search_agri_knowledge。建议：先通风 30 分钟并复查湿度；如果连续 2 小时仍偏高，生成“湿度复核工单”。</div>';
        box.scrollTop = box.scrollHeight;
    }

    function previewLeaf() {
        var file = this.files && this.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("imagePreview").innerHTML = '<img class="preview-img" src="' + e.target.result + '" alt="叶片预览">';
        };
        reader.readAsDataURL(file);
    }

    function fakeQr() {
        var cells = "";
        for (var i = 0; i < 121; i++) {
            cells += '<span class="' + ((i * 7 + i % 5) % 3 === 0 ? "" : "off") + '"></span>';
        }
        return cells;
    }

    function drawEnvChart(id) {
        if (!window.echarts || !document.getElementById(id)) return;
        var chart = echarts.init(document.getElementById(id));
        chart.setOption({
            tooltip: { trigger: "axis" },
            legend: { data: ["温度", "空气湿度", "土壤湿度"] },
            xAxis: [{ type: "category", data: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"] }],
            yAxis: [{ type: "value" }],
            series: [
                { name: "温度", type: "line", smooth: true, data: [21, 20, 25, 29, 28, 24] },
                { name: "空气湿度", type: "line", smooth: true, data: [78, 82, 72, 61, 64, 70] },
                { name: "土壤湿度", type: "line", smooth: true, data: [52, 50, 48, 39, 46, 44] }
            ]
        });
    }

    function drawCropChart(id) {
        if (!window.echarts || !document.getElementById(id)) return;
        var chart = echarts.init(document.getElementById(id));
        chart.setOption({ tooltip: { trigger: "item" }, series: [{ name: "作物结构", type: "pie", radius: "62%", data: [{ value: 35, name: "番茄" }, { value: 25, name: "草莓" }, { value: 22, name: "生菜" }, { value: 18, name: "黄瓜" }] }] });
    }

    function drawFitChart(id) {
        if (!window.echarts || !document.getElementById(id)) return;
        var chart = echarts.init(document.getElementById(id));
        chart.setOption({ tooltip: {}, xAxis: [{ type: "category", data: ["温度", "湿度", "土壤", "光照"] }], yAxis: [{ type: "value", max: 100 }], series: [{ type: "bar", data: [88, 62, 45, 71] }] });
    }

    function drawTaskChart(id) {
        if (!window.echarts || !document.getElementById(id)) return;
        var chart = echarts.init(document.getElementById(id));
        chart.setOption({ tooltip: { trigger: "item" }, series: [{ type: "pie", radius: ["45%", "70%"], data: [{ value: 2, name: "待处理" }, { value: 1, name: "处理中" }, { value: 1, name: "已闭环" }] }] });
    }


    var apiEndpoints = {
        dashboard: "/agriculture/api/dashboard",
        greenhouses: "/agriculture/api/greenhouses",
        devices: "/agriculture/api/devices",
        crops: "/agriculture/api/crop-batches",
        environment: "/agriculture/api/environment",
        ai: "/agriculture/api/langchain",
        knowledge: "/agriculture/api/knowledge",
        alarms: "/agriculture/api/work-orders",
        disease: "/agriculture/api/disease",
        trace: "/agriculture/api/trace",
        community: "/agriculture/api/community",
        visualization: "/agriculture/api/visualization"
    };

    function hydrateFromApi(done) {
        var endpoint = apiEndpoints[page];
        if (!endpoint || !window.fetch) {
            done();
            return;
        }
        fetch(endpoint, { headers: { "Accept": "application/json" } })
            .then(function (res) { return res.json(); })
            .then(function (res) {
                if (!res || res.code !== 0 || !res.data) {
                    done();
                    return;
                }
                applyApiData(page, res.data);
                state.backendLoaded = true;
                done();
            })
            .catch(function () {
                state.backendLoaded = false;
                done();
            });
    }

    function applyApiData(currentPage, data) {
        if (currentPage === "dashboard" && data.metrics) {
            state.metrics = data.metrics;
        }
        if (currentPage === "greenhouses" && data.items) {
            state.greenhouses = data.items.map(function (g) {
                return [g.code, g.crop, g.stage, g.owner, g.status, g.aiAdvice];
            });
        }
        if (currentPage === "devices" && data.items) {
            state.devices = data.items;
        }
        if (currentPage === "alarms" && data.items) {
            state.workOrders = data.items;
        }
        if (currentPage === "ai" && data.tools) {
            state.tools = data.tools;
        }
    }
    var pages = {
        dashboard: renderDashboard,
        greenhouses: renderGreenhouses,
        devices: renderDevices,
        crops: renderCrops,
        environment: renderEnvironment,
        ai: renderAi,
        knowledge: renderKnowledge,
        alarms: renderAlarms,
        disease: renderDisease,
        trace: renderTrace,
        community: renderCommunity,
        visualization: renderVisualization
    };

    if (pages[page]) {
        pages[page]();
    } else {
        app.innerHTML = '<div class="ag-page">' + card("页面不存在", '<div class="empty">未找到对应的前端 Demo 页面。</div>') + '</div>';
    }
})();