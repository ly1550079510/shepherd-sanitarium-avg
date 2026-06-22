(() => {
  const STORAGE_KEY = "shepherd_sanitarium_degree2_state";
  const SLOT_KEY = "shepherd_sanitarium_degree2_slots";
  const META_KEY = "shepherd_sanitarium_degree2_meta";
  const app = document.querySelector("#app");
  const STORY_DATA = window.SHEPHERD_STORY_DATA || {};
  const ENTITIES = STORY_DATA.entities || {};
  const ROLE_DEFS = STORY_DATA.roleDefs || {};
  const ENDING_PROFILES = STORY_DATA.endingProfiles || { common: {}, roles: {}, special: {} };
  const TRUTH_ROUTE = STORY_DATA.truthRoute || { title: "埃莉诺的文件夹", subtitle: "上帝视角真相路线", pages: [], epilogue: [] };
  const EPILOGUE_COLLECTION_ID = "__epilogue__";
  const TITLE_PRESENTATION = STORY_DATA.titlePresentation || {};
  const CHARACTER_PRESENTATION = STORY_DATA.characterPresentation || {};
  const SLOT_META = STORY_DATA.slotMeta || {};
  const PASSWORD_WORDS = STORY_DATA.passwordWords || ["OVIS", "LUSUS", "PASTOR", "SOMNIUM"];
  const SLOT_ORDER = STORY_DATA.slotOrder || Object.keys(SLOT_META);
  const BASE_HP = 10;
  const BASE_MP = 7;
  const BASE_SAN = 60;
  const MAX_SAN = 99;
  const MAX_TRUTH = 100;
  const RELATION_MIN = -30;
  const RELATION_MAX = 30;
  const SAN_VISUAL_THRESHOLD = 30;
  const VOTE_REVEAL_SLOT = "4.5";
  const TRUTH_THRESHOLDS = [25, 50, 75, 100];
  const PHYSICAL_TAGS = new Set(["attack", "generator", "escape", "weapon"]);
  const PHYSICAL_WORDS = ["疾跑", "冲", "攀", "搬", "扛", "踹", "砸", "断后", "挡住", "正面攻击", "拖拽", "速降", "布置陷阱", "修复", "启动发电机"];
  const GENERATOR_WORDS = ["发电机", "电闸", "电源", "供电", "电线", "线路", "密码", "破译", "白门", "闸门"];
  const ACTION_TIER_LABELS = {
    safe: "安全",
    push: "推进",
    gamble: "豪赌",
  };
  const TWO_MP_TAGS = new Set(["attack", "generator", "escape", "weapon"]);
  const LOCATION_GLOSSARY = STORY_DATA.locationGlossary || [];
  const NARRATIVE_DATA = window.SHEPHERD_NARRATIVE_DATA || {};
  const STAGE_NARRATIVE = window.SHEPHERD_STAGE_NARRATIVE || {};
  const OVERLAY_NARRATIVE = window.SHEPHERD_OVERLAY_NARRATIVE || {};
  const SLOT_STAKES = NARRATIVE_DATA.slotStakes || {};
  const INTRO_NOTICES = NARRATIVE_DATA.introNotices || {};
  const RECOVERY_COPY = NARRATIVE_DATA.recoveryCopy || {};
  const FATAL_COPY = NARRATIVE_DATA.fatalCopy || {};
  const PROSE_CONFIG = NARRATIVE_DATA.proseConfig || {};
  const ROLE_SLOT_BASES = PROSE_CONFIG.roleSlotBases || {};
  const ANJIE_SLOT_BASE = ROLE_SLOT_BASES.anjie || {};
  const PATRICK_SLOT_BASE = ROLE_SLOT_BASES.patrick || {};
  const GENERIC_ROLE_SLOT_BASES = ROLE_SLOT_BASES.genericRoleBases || PROSE_CONFIG.genericRoleBases || {};
  const ROLE_ACTION_DETAILS = PROSE_CONFIG.roleActionDetails || ROLE_SLOT_BASES.roleActionDetails || GENERIC_ROLE_SLOT_BASES.roleActionDetails || {};
  const GENERIC_ROLE_ACTION_DETAILS = ROLE_ACTION_DETAILS;
  const ANJIE_ACTION_DETAILS = ROLE_ACTION_DETAILS.anjie || [];
  const PATRICK_ACTION_DETAILS = ROLE_ACTION_DETAILS.patrick || [];
  const ROUTE_PARAGRAPH_LIMIT = 240;
  const PATRICK_PARAGRAPH_LIMIT = 240;
  const PAGED_ROUTE_IDS = new Set(["patrick", "anjie", "yamada", "debora", "fan", "ziche"]);
  const COMPACT_RESULT_ROUTE_IDS = new Set(["yamada", "debora", "fan", "ziche", "patrick", "anjie"]);
  const PLAYABLE_ROLE_IDS = ["fan", "ziche", "yamada", "anjie", "debora", "patrick"].filter((id) => ROLE_DEFS[id]);
  const PC_SUPPER_SCENE_PROFILES = {
    fan: {
      bondTarget: "meruru",
      stateVoices: {
        wounded: "长桌尽头像祭坛一样发亮，伤口提醒你别急着把疼痛说成恩典。你还得先活着，才有资格谈宽恕。",
        lowSan: "空座里像有人低声祷告。你分不清那是信仰、诱惑，还是疗养院借你的声音替罪人开脱。",
        truthHigh: "你终于看见试炼背后的手。长桌上少掉的每个人都不是罪证，而是被循环反复摆上来的祭品。",
        vote: "票纸压在桌面上时，你比谁都清楚，审判一旦开始，就再也不能只靠慈悲收场。",
        powered: "灯光稳住了，你却不敢把它叫作救赎。门会开，可被留下的罪名不会自己消失。",
        truthMid: "线索像祷文一样一节节接上。你还没看见全部神意，只先看见有人把神意当成刀。",
        generator: "发电机的光照到桌边，你把它当成临时烛火。只要火还没灭，就还可以替人争一口气。",
        bond: "梅露露的名字落在你心口。你越想替她挡住痛，就越怕自己其实只是在寻找被牺牲的理由。",
        result: "刚才的选择像被放回盘中的圣餐。你低头看了一眼，确认自己没有把别人的痛说得太轻。",
      },
      stateChips: {
        wounded: "心声：疼痛不等于赦免",
        lowSan: "心声：空座在祷告",
        truthHigh: "心声：祭品露出全貌",
        vote: "心声：审判已经开始",
        powered: "心声：灯亮但罪未清",
        truthMid: "心声：祷文接上证词",
        generator: "心声：临时烛火",
        bond: "心声：梅露露压在心口",
        result: "心声：选择被端回桌上",
        base: "心声：把试炼放上桌面",
      },
      slotVoices: {
        "1.1": "你在空长桌前醒来，先把恐惧压成一句祷告。若这是试炼，你至少要先弄清谁被迫充当羔羊。",
        "1.2": "众人坐到同一张桌边时，你本能地想维持秩序，却也知道秩序最容易被包装成审判。",
        "1.3": "走廊像被拉长的告解室。你一边记下门牌，一边提醒自己别把每个求救声都听成神意。",
        "1.4": "私下接触让善意变得危险。你愿意靠近别人，却必须确认自己不是在替凶手找借口。",
        "2.1": "深处房间的冷气贴上皮肤。你把恐惧按进掌心，想知道这栋楼到底要谁先承认有罪。",
        "2.2": "线索被搬回桌面时，没人真正干净。你不急着定罪，只先辨认谁在借宽恕逃开责任。",
        "2.3": "电闸房的噪音像粗糙的钟声。你盯着供电和密码，知道每一次点亮都可能换来新的牺牲。",
        "2.4": "第二次聚集像一场未完成的弥撒。每个人都捧出一点真话，也藏回一点更锋利的私心。",
        "3.1": "不安坐到你对面，像等你替它命名。你不想让恐慌传染开，只能先把声音压低。",
        "3.2": "裂缝出现时，你终于承认这不是普通密室。你仍想救人，却不知道救赎会不会先要求代价。",
        "3.3": "死讯落下后，空位比活人更重。你强迫自己看向现场，因为移开眼就等于替死亡保持沉默。",
        "3.4": "投票前的长桌像祭坛，也像刑场。你必须在劝告与指控之间，选一条还能让人活下去的路。",
        "4.1": "石室前的每一步都带着审判味。你想让众人别急着处刑，却也知道沉默会把刀递给别人。",
        "4.2": "证据被摆到桌上时，你听见自己心里那句宽恕开始动摇。事实不能因为怜悯就被软化。",
        "4.3": "最后游说不是祈祷，而是把人从边缘拉回来。你每说一句，都在衡量谁会因此更恨你。",
        "4.4": "票纸落下的一刻，你发现审判从来不只属于疗养院。写下名字的人，也会被名字反过来写住。",
        "4.5": "票型公开时，长桌没有替任何人辩护。你只能看着罪名落地，再决定是否还要谈宽恕。",
        "5.1": "警报响起时，试炼撕掉了外壳。你还站在桌边，因为有人必须在怪物面前继续叫出人的名字。",
        "5.2": "追逐把祷告压成喘息。你每回头一次，都在问自己该救的是眼前的人，还是还没说完的真相。",
        "5.3": "白门前的装置像最后一盏祭灯。你不敢相信门会无条件打开，只能先把能付的代价算清。",
        "5.4": "雾压到桌边时，你把自己的恐惧也放上去。若门后还有清晨，至少别让它只属于无罪的人。",
      },
    },
    ziche: {
      bondTarget: "debora",
      stateVoices: {
        wounded: "伤口把每条退路都缩短了。你盯着空桌边的阴影，先算还能走几步，再算谁会拖慢你。",
        lowSan: "空座的距离开始变形。你知道这不对，可脑子仍在本能地给每一把椅子标上危险等级。",
        truthHigh: "真相终于把地形翻到背面。你看清这张长桌不是聚会地点，而是循环反复分配猎物的位置图。",
        vote: "票纸上桌之后，废话都变成风险。你只关心谁会被推出去，以及那会不会挡住你的出口。",
        powered: "灯亮了，门也许会开。你没有放松，只把发电机、路线和可能背叛的人重新排了一遍。",
        truthMid: "线索开始咬合，像一张能反向使用的地图。你还没信任它，但已经知道哪里不能再走。",
        generator: "发电机响起来时，你先看门，再看人。光线不是希望，是一份暂时可用的战术资源。",
        bond: "狄波拉的名字被你放进路线旁边。你讨厌额外变量，却更讨厌把能活的人随手丢掉。",
        result: "刚才那一步已经改变了地形。你把结果压进脑子里，像在更新一张会流血的逃生图。",
      },
      stateChips: {
        wounded: "心声：退路被伤口缩短",
        lowSan: "心声：空座变成危险等级",
        truthHigh: "心声：看见猎物分配图",
        vote: "心声：票纸改变出口",
        powered: "心声：灯光只是资源",
        truthMid: "心声：地图开始反转",
        generator: "心声：供电进入战术表",
        bond: "心声：额外变量不能丢",
        result: "心声：路线重新计算",
        base: "心声：先看退路",
      },
      slotVoices: {
        "1.1": "你在空长桌前醒来，第一眼先找门缝、灯位和能砸开的东西。恐惧可以晚点处理，出口不能。",
        "1.2": "大厅会面像把所有风险摆到同一张桌上。你不急着认识人，只先判断谁会挡路，谁能利用。",
        "1.3": "走廊初探时，你把脚步声、回声和死角一并记住。故事怎么解释不重要，地形先说真话。",
        "1.4": "私下接触不是交朋友，是确认变量。你让语气保持冷硬，好看清对方会不会先露出破绽。",
        "2.1": "深处房间让退路变少。你把每个拐角都折进脑子，像在给一张会吃人的地图补线。",
        "2.2": "交换线索时，你只听能改变行动顺序的部分。情绪会误事，路线和筹码不会。",
        "2.3": "发电机与密码同时摆出来，你立刻明白这不是谜题，是谁能先控制门的问题。",
        "2.4": "第二次聚集让人群重新洗牌。你站在能看见出口的位置，听他们把弱点说成意见。",
        "3.1": "不安升温时，你先确认自己没被围住。恐慌会传染，但更要命的是有人趁乱改路。",
        "3.2": "裂缝临界让建筑不再可信。你仍按物理规则算，因为放弃规则就等于把命交出去。",
        "3.3": "死讯和异象同时砸下来，你没有急着哀悼。活人还会移动，死人只会改变所有人的站位。",
        "3.4": "投票前自由时段是最后的布防。你不信游说，只信谁在关键时刻会站到哪边。",
        "4.1": "审判序幕让石室变成窄口。你看见每个人坐下的位置，也看见谁最容易被推出去。",
        "4.2": "证据交锋时，你把事实当工具，不当道德。能压住局面的证据，才值得留到最亮的位置。",
        "4.3": "最后游说像抢占出口前的最后交火。你说的每句话，都只服务于下一段活路。",
        "4.4": "投票处决没有体面可言。你写下名字，只是在让最坏的路线避开自己。",
        "4.5": "票型公开时，局势被重新标红。你不为结果叹气，只确认第五小时还能从哪里突围。",
        "5.1": "警报一响，故事终于变成追猎。你把怪物速度、门距和同伴体力同时塞进脑子。",
        "5.2": "追猎与断后没有第二次排练。你每一步都按秒算，连回头都要有收益。",
        "5.3": "终门前线只剩硬条件。密码、供电、站位，少一项都可能把所有人重新锁回去。",
        "5.4": "白门前的雾像最后一道封锁线。你不问它通向哪里，只问自己能不能活着穿过去。",
      },
    },
    yamada: {
      bondTarget: "emily",
      stateVoices: {
        wounded: "疼痛让表情管理变得困难。你把手藏到桌下，先确认没人看出你快撑不住。",
        lowSan: "空座像观众席一样盯着你。你还在微笑，却已经忘了这张脸原本是给谁看的。",
        truthHigh: "真相终于撕开礼貌的薄膜。长桌上每个空位都像一面镜子，照出你藏得最深的恐惧。",
        vote: "票纸摊开时，所有客套话都失效了。你必须决定这次该装作镇定，还是干脆让别人看见裂缝。",
        powered: "灯亮之后，表情反而更难藏。你把出口挂在脸上，却把真正想带走的人藏在心里。",
        truthMid: "线索开始绕到你背后。你还能维持语气平稳，但已经不能假装自己只是旁观者。",
        generator: "发电机的光让每张脸都清楚起来。你先检查自己的表情，再检查谁看见了你的迟疑。",
        bond: "艾米莉的慌张压住了你的伪装。你想保护她，却害怕那会暴露你并没有自己表现得那么冷静。",
        result: "刚才的选择像口红印一样留在杯沿。你擦不掉，只能决定下一秒该换哪张脸。",
      },
      stateChips: {
        wounded: "心声：疼痛破坏表情",
        lowSan: "心声：空座都在看你",
        truthHigh: "心声：礼貌薄膜裂开",
        vote: "心声：客套话失效",
        powered: "心声：灯光照见迟疑",
        truthMid: "心声：旁观身份动摇",
        generator: "心声：先检查表情",
        bond: "心声：艾米莉压住伪装",
        result: "心声：换一张脸继续",
        base: "心声：先戴好表情",
      },
      slotVoices: {
        "1.1": "你在空长桌前醒来，先把呼吸调匀，再决定该露出多少惊慌。脸色不能比情报先失控。",
        "1.2": "大厅会面是第一场演出。你看着每个人的反应，给自己挑了一张最不容易被怀疑的脸。",
        "1.3": "走廊初探时，你让脚步显得迟疑一点。太冷静会惹人注意，太害怕又会被人利用。",
        "1.4": "私下接触最考验分寸。你把关心说得轻一点，把真正想问的问题藏在尾音后面。",
        "2.1": "深处房间逼得人露出本能。你把自己的本能压回袖口，只留下足够自然的犹豫。",
        "2.2": "线索交换像互相试妆。每个人都拿出一点真实，你只拿出别人最容易接受的那部分。",
        "2.3": "发电机与密码让局面变得实际。你知道这时再装无辜没用，只能装作早有准备。",
        "2.4": "第二次聚集时，大家已经开始记仇。你让语气保持柔和，心里却把每条视线都分门别类。",
        "3.1": "不安升温时，笑容会显得刺眼。你把它收得更浅，像只是害怕，而不是正在评估所有人。",
        "3.2": "裂缝临界让现实开始脱妆。你仍试图保持礼貌，因为那是最后还能控制的东西。",
        "3.3": "死讯落下后，表演变得可耻。你盯着空位，第一次不确定该不该继续把镇定演完。",
        "3.4": "投票前自由时段像后台换装。你必须在别人看见你之前，决定下一张脸该站在哪边。",
        "4.1": "审判序幕让每句客气都带上刀背。你坐稳姿态，心里却已经开始计算票会从哪里来。",
        "4.2": "证据交锋时，语气比证词更危险。你让自己听起来合理，不让任何人听出你在害怕。",
        "4.3": "最后游说需要恰到好处的真诚。你知道真诚太多会失控，太少又救不了人。",
        "4.4": "投票处决时，礼貌终于没有位置。你写下名字，像把一张再也戴不回去的面具放上桌。",
        "4.5": "票型公开后，每个人的脸都变得难看。你看着它们，知道自己的脸也不会例外。",
        "5.1": "警报响起时，伪装被迫简化成一句“跟上”。你没有空哭，只能先把声音压稳。",
        "5.2": "追猎与断后让每张脸都掉色。你一边跑，一边想自己还能不能把恐惧藏到门后。",
        "5.3": "终门前线要求硬答案。你把犹豫吞下去，告诉自己现在的漂亮话必须能开门。",
        "5.4": "白门前的雾让人无处整理仪容。你终于允许自己露出一点真脸，只要没人因此停下。",
      },
    },
    anjie: {
      bondTarget: "patrick",
      stateVoices: {
        wounded: "长桌边只剩你还坐着，疼痛把证词割成短句。活下去，核对，别让结论替你先倒下。",
        lowSan: "空座像在慢慢移动。你知道这不合逻辑，可手指已经先一步把每个不存在的人名写进边栏。",
        truthHigh: "你终于意识到，画里少掉的不是别人，而是所有被循环临时擦去的证词。只剩你还坐在桌边，必须把它们重新叫回来。",
        vote: "票纸还没完全落下，长桌却已经空得像审判结束。你必须证明的不是自己聪明，而是这条证据链还来得及救人。",
        powered: "灯终于稳住了，桌面上的阴影却没有散。你把出口写在最后一行，提醒自己门开不等于真相成立。",
        truthMid: "那些空椅子开始对应上证词。你不敢说已经看清全貌，只能先把每一个缺口都钉在纸上。",
        generator: "发电机的进度像桌上一截快烧完的蜡。你知道光不够，但至少能照出下一处矛盾。",
        bond: "你把派翠克的名字单独圈出，又很快划掉那个圈。证据不能被感情污染，可你已经没法假装她只是变量。",
        result: "刚才的选择还留在桌面上，像一枚没有收走的餐刀。你把结果压平，继续找它会割向谁。",
      },
      stateChips: {
        wounded: "心声：疼痛切断笔迹",
        lowSan: "心声：空座开始移动",
        truthHigh: "心声：证词正在回到桌边",
        vote: "心声：审判压近长桌",
        powered: "心声：灯亮但真相未定",
        truthMid: "心声：缺口逐渐对齐",
        generator: "心声：电光照出矛盾",
        bond: "心声：派翠克被圈出",
        result: "心声：结果留在桌面",
        base: "心声：把恐惧压成编号",
      },
      slotVoices: {
        "1.1": "你盯着空下来的长桌位置，先把恐惧压成编号：门、灯、广播、笔记本。只要还能排序，你就还没有输。",
        "1.2": "所有人终于被摆到同一张桌边。你一边听他们说话，一边在心里给每个停顿标上疑点。",
        "1.3": "走廊像被拉长的餐布，尽头所有褶皱都藏着未说完的话。你不能只看见害怕，还要看见害怕指向哪里。",
        "1.4": "私下接触比公开证词更危险。你把每一句善意都翻到背面，确认它是不是另一个陷阱。",
        "2.1": "更深的房间把人声压低了。你告诉自己，越安静的地方越要先找能留下痕迹的东西。",
        "2.2": "线索被搬上桌时，没有一块真正干净。你只能先判断哪一块脏得最不自然。",
        "2.3": "电闸房的噪音像在替所有人倒数。你把密码、供电和出口连成一条线，暂时不去想它会勒住谁。",
        "2.4": "第二次聚集不像会面，更像预演审判。你看见每个人都在选择自己要隐瞒的那一部分。",
        "3.1": "不安已经坐到你对面。你不该被它吓住，至少在它开口之前，要先写下它来的方向。",
        "3.2": "裂缝把桌面分成两半。你必须承认，证据链之外也有东西正在伸手改写现场。",
        "3.3": "死讯落下后，空位终于有了重量。你逼自己看完整个现场，因为移开眼才是这栋楼最想要的反应。",
        "3.4": "投票前的每一句话都像餐刀摆位。你需要说服别人，也需要防止自己被推成最方便的解释。",
        "4.1": "审判序幕把所有疑点推到光下。你把笔记本翻到最乱的一页，提醒自己不能被语气带走。",
        "4.2": "证据交锋像把桌面切成网格。你必须让每条线都接得上，否则真相会被更响的声音压过去。",
        "4.3": "最后游说不是证明自己正确，而是证明别人还有时间改判。你把最关键的证词留到能救人的位置。",
        "4.4": "票纸落下时，逻辑也会发抖。你写下名字，知道这不是结论，只是一条会流血的推论。",
        "4.5": "票型公开时，证据链被迫接受死亡。你看着名字摊开，确认哪一环已经断掉。",
        "5.1": "警报响起时，长桌像被骤然撤空。你还在桌边，因为必须有人把怪物出现前后的顺序记下来。",
        "5.2": "追逐把所有推理都压成呼吸。你仍在心里数步数，因为恐惧如果不能被记录，就会直接变成命运。",
        "5.3": "白门前的装置像最后一份证词。你只差一点就能证明出口存在，也只差一点就会证明自己错得太晚。",
        "5.4": "门外的雾已经压到桌边。你把自己的名字写在最后，因为出去之后，仍要有人记得为什么能出去。",
      },
    },
    debora: {
      bondTarget: "yamada",
      stateVoices: {
        wounded: "疼痛让你很难继续装得无害。你把肩背垮得更低，先确认没人发现你已经快撑不住。",
        lowSan: "空座像一排等着拆穿你的观众。你越想缩小自己，越觉得每张椅子都在喊你的名字。",
        truthHigh: "真相把旧债一笔笔推到桌面。你终于看清，自己不是旁观者，只是一直装作没有坐在席上。",
        vote: "票纸落到桌上时，伪装会变得很薄。你知道再温和的语气，也可能把别人送上死路。",
        powered: "灯光稳住后，你反而无处躲藏。出口越近，旧账越像一只手，把你从角落拖出来。",
        truthMid: "线索开始对上旧债。你还想把自己藏低一点，可有些名字已经不允许你继续装傻。",
        generator: "发电机亮起时，你先想到谁会借这点光看清你。推进有用，但暴露也一样有用。",
        bond: "山田的镇定让你有点不安。你看得出那是伪装，也知道自己没有资格轻易拆穿。",
        result: "刚才的选择像一张欠条压回桌面。你装作没看见，却已经在心里算它会什么时候讨回来。",
      },
      stateChips: {
        wounded: "心声：无害外壳变薄",
        lowSan: "心声：空座喊出名字",
        truthHigh: "心声：旧债上桌",
        vote: "心声：温和也会杀人",
        powered: "心声：光线拖你出角落",
        truthMid: "心声：旧账开始对齐",
        generator: "心声：推进也会暴露",
        bond: "心声：看见山田的面具",
        result: "心声：欠条被压回桌面",
        base: "心声：先缩进角落",
      },
      slotVoices: {
        "1.1": "你在空长桌前醒来，先把肩膀放低。只要看起来不重要，就还有时间看清谁真正危险。",
        "1.2": "大厅会面时，你让自己像一盏不亮的灯。别人越急着说话，你越容易听见藏在后面的算计。",
        "1.3": "走廊初探让每个人都暴露习惯。你跟在不显眼的位置，记下谁以为自己没人盯着。",
        "1.4": "私下接触适合把话说软。你给对方留台阶，也给自己留一条随时后退的缝。",
        "2.1": "深处房间把过去的味道翻出来。你没有急着碰它，只先确认这笔旧账会牵到谁。",
        "2.2": "线索交换时，你把自己知道的部分切得很薄。太完整的真话，会让人发现你一直在看。",
        "2.3": "发电机与密码让局面有了价格。你不抢最亮的位置，只想知道谁会为开门付账。",
        "2.4": "第二次聚集时，人群已经开始互相估价。你坐得安静，像没有参与，却把每个眼神都收下。",
        "3.1": "不安升温让伪装更容易失手。你把声音压得更软，免得别人先听见你的判断。",
        "3.2": "裂缝临界时，装傻忽然不够用了。你仍想退后一步，却发现身后也有东西在逼近。",
        "3.3": "死讯落下后，角落不再安全。你看着空位，知道有些债会借着尸体找上门。",
        "3.4": "投票前自由时段像最后一次调停。你越想把话说圆，越知道圆滑也会留下刀口。",
        "4.1": "审判序幕让每个人都想找替罪羊。你把自己放低，却不能低到让别人随手踩过去。",
        "4.2": "证据交锋时，真话会变成武器。你只拿出必要的一截，免得武器转回来指向自己。",
        "4.3": "最后游说需要温和，也需要狠心。你知道该扶谁一把，也知道该让谁自己摔下去。",
        "4.4": "投票处决让无害失去意义。你写下名字时，终于承认自己也在推这张桌子。",
        "4.5": "票型公开时，所有缓和都被撕开。你看着结果，知道下一小时没人会再完全相信无害。",
        "5.1": "警报响起后，伪装只剩求生功能。你把声音放低，不是退让，是为了让更多人听见该往哪跑。",
        "5.2": "追猎与断后逼你放弃圆滑。你第一次不再装得轻飘，因为再轻就会被风直接吹走。",
        "5.3": "终门前线没有无关的人。你把旧账、密码和出口排在一起，知道迟早要付其中一项。",
        "5.4": "白门前的雾像一块账本封皮。你走过去时，终于不再假装自己没有欠下任何名字。",
      },
    },
    patrick: {
      bondTarget: "anjie",
      stateVoices: {
        wounded: "疼痛让回声贴得更近。你坐在空长桌边，分不清是伤口在叫，还是亡者在替你数秒。",
        lowSan: "空座里全是声音。你知道活人听不见，可它们已经把你的名字一遍遍放回桌面。",
        truthHigh: "真相从墙后站到桌边。你终于明白那些回声不是幻觉，而是循环没能埋干净的遗言。",
        vote: "票纸公开时，亡者也像在旁听。你不确定自己该替谁说话，只知道沉默同样会留下回声。",
        powered: "灯亮之后，回声没有退。门也许会开，可跟在你身后的那些声音还没找到出口。",
        truthMid: "线索开始和回声对上。你不再急着解释自己听见什么，只先确认它们要你看向哪里。",
        generator: "发电机的震动压过一部分杂音。你趁这点安静，把最清楚的那道声音记住。",
        bond: "安洁的名字在回声里变得很清楚。你怕她把一切都写成证据，也怕她没有写下你。",
        result: "刚才的选择在墙里重复了一遍。你听完它，才知道自己其实已经不能回到之前。",
      },
      stateChips: {
        wounded: "心声：伤口替亡者数秒",
        lowSan: "心声：空座全是声音",
        truthHigh: "心声：遗言站到桌边",
        vote: "心声：亡者旁听投票",
        powered: "心声：门开但回声未退",
        truthMid: "心声：回声对上线索",
        generator: "心声：震动压低杂音",
        bond: "心声：安洁被回声叫清",
        result: "心声：选择在墙里重复",
        base: "心声：先听回声",
      },
      slotVoices: {
        "1.1": "你在空长桌前醒来，先听见不是广播，而是墙里更轻的回声。它们没有解释，只把你往前推。",
        "1.2": "大厅会面让活人的声音变得拥挤。你听他们自我介绍，也听见更旧的名字贴在桌下。",
        "1.3": "走廊初探时，回声比脚步先到。你不急着相信眼睛，因为这栋楼最会把看见的东西伪装成答案。",
        "1.4": "私下接触时，别人以为你在走神。其实你在分辨哪一句来自对方，哪一句来自更深的地方。",
        "2.1": "深处房间让回声变得潮湿。你靠近它们，像靠近一扇只对死人开着的门。",
        "2.2": "线索交换时，活人只拿出纸面。你听见纸背后的声音，知道还有东西没被允许说完。",
        "2.3": "发电机与密码让墙体轻轻发颤。你把震动当成节拍，试着跟上那些断开的遗言。",
        "2.4": "第二次聚集时，长桌下的回声变多了。每个人说出的真话，都像唤醒了另一个没说完的人。",
        "3.1": "不安升温时，你听见空气里多了一层喘息。它不属于任何活人，却比活人更急。",
        "3.2": "裂缝临界让墙后的声音漏出来。你不再怀疑自己听见了什么，只怕自己听懂得太晚。",
        "3.3": "死讯落下后，回声忽然有了名字。你看向空位，知道那里并不真的空着。",
        "3.4": "投票前自由时段里，亡者比活人更安静。你害怕这种安静，因为它像在等你替它开口。",
        "4.1": "审判序幕让石室像一只耳朵。你坐进去，感觉每句话都会被墙记住很久。",
        "4.2": "证据交锋时，回声也在挑选证词。你必须分清它们是在提醒，还是在诱导你。",
        "4.3": "最后游说像对活人说话，也像对死者道歉。你每靠近一个人，墙里就轻轻响一下。",
        "4.4": "投票处决时，票纸摩擦声像骨头。你写下名字，知道这声音今晚不会停。",
        "4.5": "票型公开后，回声终于变得具体。它们不急着喊冤，只等你承认有人被留在了后面。",
        "5.1": "警报响起时，所有回声一起抬头。你听见怪物，也听见它背后更古老的饥饿。",
        "5.2": "追猎与断后让声音碎成风。你跑在它们中间，像被一群没有身体的人推着走。",
        "5.3": "终门前线前，回声忽然指向同一个地方。你不知道那是不是出口，只知道它们第一次如此一致。",
        "5.4": "白门前的雾吞掉脚步声，却吞不掉亡者。你走向门时，感觉每个名字都跟在身后。",
      },
    },
  };
  const GENERATOR_OPPORTUNITY_PLAN = {
    fan: [
      { slotId: "2.1", optionKey: "A", kind: "support" },
      { slotId: "2.3", optionKey: "A", kind: "main" },
      { slotId: "3.3", optionKey: "B", kind: "support" },
      { slotId: "3.4", optionKey: "A", kind: "main" },
      { slotId: "4.1", optionKey: "A", kind: "main" },
      { slotId: "4.3", optionKey: "B", kind: "support" },
      { slotId: "5.3", optionKey: "A", kind: "main" },
      { slotId: "5.4", optionKey: "A", kind: "fallback" },
    ],
    ziche: [
      { slotId: "1.1", optionKey: "A", kind: "support" },
      { slotId: "2.3", optionKey: "A", kind: "main" },
      { slotId: "3.2", optionKey: "A", kind: "main" },
      { slotId: "3.4", optionKey: "B", kind: "support" },
      { slotId: "4.1", optionKey: "A", kind: "main" },
      { slotId: "5.2", optionKey: "A", kind: "main" },
      { slotId: "5.3", optionKey: "B", kind: "support" },
      { slotId: "5.4", optionKey: "B", kind: "fallback" },
    ],
    yamada: [
      { slotId: "1.3", optionKey: "A", kind: "support" },
      { slotId: "2.1", optionKey: "A", kind: "main" },
      { slotId: "2.3", optionKey: "A", kind: "main" },
      { slotId: "3.2", optionKey: "B", kind: "support" },
      { slotId: "3.4", optionKey: "B", kind: "main" },
      { slotId: "4.4", optionKey: "A", kind: "main" },
      { slotId: "5.2", optionKey: "B", kind: "support" },
      { slotId: "5.4", optionKey: "A", kind: "fallback" },
    ],
    debora: [
      { slotId: "1.3", optionKey: "A", kind: "support" },
      { slotId: "2.3", optionKey: "A", kind: "main" },
      { slotId: "3.3", optionKey: "A", kind: "main" },
      { slotId: "3.4", optionKey: "B", kind: "support" },
      { slotId: "4.1", optionKey: "A", kind: "main" },
      { slotId: "5.2", optionKey: "A", kind: "main" },
      { slotId: "5.3", optionKey: "A", kind: "support" },
      { slotId: "5.4", optionKey: "A", kind: "fallback" },
    ],
    anjie: [
      { slotId: "2.1", optionKey: "A", kind: "main" },
      { slotId: "2.3", optionKey: "A", kind: "support" },
      { slotId: "3.2", optionKey: "B", kind: "support" },
      { slotId: "3.4", optionKey: "A", kind: "main" },
      { slotId: "4.3", optionKey: "A", kind: "main" },
      { slotId: "5.1", optionKey: "B", kind: "support" },
      { slotId: "5.2", optionKey: "A", kind: "main" },
      { slotId: "5.4", optionKey: "A", kind: "fallback" },
    ],
    patrick: [
      { slotId: "2.1", optionKey: "A", kind: "support" },
      { slotId: "2.3", optionKey: "A", kind: "main" },
      { slotId: "3.1", optionKey: "A", kind: "main" },
      { slotId: "3.3", optionKey: "B", kind: "support" },
      { slotId: "4.4", optionKey: "A", kind: "main" },
      { slotId: "5.1", optionKey: "A", kind: "support" },
      { slotId: "5.3", optionKey: "A", kind: "main" },
      { slotId: "5.4", optionKey: "A", kind: "fallback" },
    ],
  };
  const GENERATOR_OPPORTUNITY_INDEX = Object.fromEntries(
    Object.entries(GENERATOR_OPPORTUNITY_PLAN).map(([roleId, entries]) => [
      roleId,
      new Map(entries.map((entry) => [`${entry.slotId}:${entry.optionKey}`, entry])),
    ]),
  );
  const buildAnjieSlotStageLines = STAGE_NARRATIVE.buildAnjieSlotStageLines || (() => []);
  const buildPatrickSlotStageLines = STAGE_NARRATIVE.buildPatrickSlotStageLines || (() => []);
  const buildYamadaSlotStageLines = STAGE_NARRATIVE.buildYamadaSlotStageLines || (() => []);
  const buildDeboraSlotStageLines = STAGE_NARRATIVE.buildDeboraSlotStageLines || (() => []);
  const buildFanSlotStageLines = STAGE_NARRATIVE.buildFanSlotStageLines || (() => []);
  const buildZicheSlotStageLines = STAGE_NARRATIVE.buildZicheSlotStageLines || (() => []);
  const buildAnjieAnchorOverlayLines = OVERLAY_NARRATIVE.buildAnjieAnchorOverlayLines || (() => []);
  const buildPatrickAnchorOverlayLines = OVERLAY_NARRATIVE.buildPatrickAnchorOverlayLines || (() => []);
  const buildYamadaAnchorOverlayLines = OVERLAY_NARRATIVE.buildYamadaAnchorOverlayLines || (() => []);
  const buildDeboraAnchorOverlayLines = OVERLAY_NARRATIVE.buildDeboraAnchorOverlayLines || (() => []);

  const BASE_OPTIONS = structuredClone(window.BRANCH_OPTIONS || {});
  BASE_OPTIONS.patrick = BASE_OPTIONS.patrick || {};
  BASE_OPTIONS.patrick["2.4"] = BASE_OPTIONS.patrick["2.4"] || {
    A: "在众人第一次汇总线索时，她将四个拉丁词拆开念诵，试图辨认哪一个更像写给门外世界的悼词。",
    B: "她私下拉住安洁，把自己在焚烧房与藤蔓前感到的“脉搏”告诉对方，请她用更冷静的逻辑替自己校准这份灵感。",
    C: "**【休息】** 她独自停在灯影尽头，缓慢调匀呼吸，聆听大厅外每一阵脚步里夹带的心跳，像在等待一位迟来的亡者。",
  };

  const DEFAULT_RELATIONS = Object.keys(ENTITIES).reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  const RELATION_BANDS = [
    { min: 20, label: "追随" },
    { min: 10, label: "信任" },
    { min: 0, label: "观望" },
    { min: -10, label: "疏离" },
    { min: -20, label: "敌意" },
    { min: -30, label: "仇视" },
  ];

  const SUSPICION_SUBJECTS = ["player", ...Object.keys(ENTITIES)];
  const STORY_ANCHORS = STORY_DATA.storyAnchors || {
    firstGather: "1.2",
    secondGather: "2.4",
    meruruDeath: "3.3",
    finalVote: "4.4",
    patrickAwakening: "5.1",
  };
  const SLOT_POSITION_BLUEPRINTS = STORY_DATA.slotPositionBlueprints || {};
  const OPTION_MODULES = compileOptionModules(BASE_OPTIONS);
  const FALLBACK_ROLE_ID = Object.keys(ROLE_DEFS)[0] || null;
  const PRESENTATION_ROLE_ORDER = Object.entries(CHARACTER_PRESENTATION)
    .sort(([, a], [, b]) => Number(a.paintingOrder || 0) - Number(b.paintingOrder || 0))
    .map(([id]) => id);
  const NORMAL_PRESENTATION_ROLE_ORDER = PRESENTATION_ROLE_ORDER.filter((id) => !CHARACTER_PRESENTATION[id]?.truthOnly);
  const TRUTH_PRESENTATION_ROLE_ORDER = PRESENTATION_ROLE_ORDER.filter((id) => CHARACTER_PRESENTATION[id]?.truthOnly);
  const STORY_DATA_ISSUES = [
    !app && "#app 容器缺失",
    !Object.keys(ENTITIES).length && "entities 缺失",
    !Object.keys(ROLE_DEFS).length && "roleDefs 缺失",
    !Object.keys(SLOT_META).length && "slotMeta 缺失",
    !SLOT_ORDER.length && "slotOrder 缺失",
  ].filter(Boolean);

  if (!app) {
    console.error("[Shepherd] Missing #app container.");
    return;
  }








  let audioCtx = null;
  let state = createBootState();
  let titlePreviewRoleId = null;
  let titleTouchArmedRoleId = null;
  let titlePreviewLockUntil = 0;
  let epilogueAudio = null;
  let epilogueAudioTimer = null;
  let epilogueAudioSeeking = false;
  let epilogueAudioSeekControl = null;
  let epilogueTextScrollTimer = null;

  if (STORY_DATA_ISSUES.length) {
    renderFatal(null, [
      "页面已拦截本次启动，避免在缺少故事数据时进入白屏状态。",
      `缺失项：${STORY_DATA_ISSUES.join(" / ")}`,
      "请确认 `story-data.js` 已成功加载且位于 `app.js` 之前。",
    ]);
    return;
  }

  function defaultState() {
    return {
      screen: "title",
      overlay: null,
      selectedRole: null,
      slotIndex: 0,
      phase: "decision",
      scenePage: 0,
      truthCollectionId: null,
      truthPageIndex: 0,
      epilogueActIndex: 0,
      epilogueFast: false,
      galleryEnding: null,
      scene: null,
      notice: "",
      fast: false,
      sound: true,
      route: [],
      log: [],
      undoStack: [],
      archive: {},
      autosave: false,
      finished: false,
      outcome: null,
      stats: { hp: BASE_HP, mp: BASE_MP, san: BASE_SAN, truth: 0 },
      maxStats: { hp: BASE_HP, mp: BASE_MP, san: MAX_SAN, truth: MAX_TRUTH },
      generators: { progress: 0, words: [] },
      relations: structuredClone(DEFAULT_RELATIONS),
      suspicion: {},
      visits: {},
      clues: [],
      items: [],
      keyChoices: {},
      alliances: {},
      npcPositions: {},
      playerPosition: null,
      deadEntities: [],
      voteLedger: {},
      voteTally: {},
      voteDeaths: [],
      exiledByVote: false,
      flags: {
        meruruDead: false,
        meruruBlessing: false,
        emilyProtected: false,
        patrickBond: false,
        patrickMercy: false,
        patrickAwakened: false,
        karlExposed: 0,
        playerMarked: false,
        voteOutcome: null,
        voteTarget: null,
        voteRevealPending: false,
        truthSeen: 0,
        restUsedSlot: null,
      },
    };
  }

  function createBootState() {
    const saved = loadState();
    let boot = normalizeState(saved || defaultState());
    const qaPreset = getQaPresetFromLocation();
    if (qaPreset) {
      boot = normalizeState({ ...boot, ...qaPreset.state, scene: qaPreset.scene || null });
    } else if (boot.screen === "truth" && isTruthRouteUnlocked()) {
      boot.overlay = null;
      boot.phase = "decision";
      boot.scene = null;
    } else {
      boot.screen = "title";
      boot.overlay = null;
    }
    return boot;
  }

  function getQaPresetFromLocation() {
    try {
      const url = new URL(window.location.href);
      const qa = url.searchParams.get("qa");
      if (!qa) return null;
      if (qa === "low-san") {
        return {
          state: {
            screen: "game",
            selectedRole: "patrick",
            slotIndex: 0,
            phase: "decision",
            scenePage: 0,
            stats: { hp: BASE_HP, mp: BASE_MP, san: 18, truth: 0 },
            maxStats: { hp: BASE_HP, mp: BASE_MP, san: MAX_SAN, truth: MAX_TRUTH },
            generators: { progress: 0, words: [] },
            relations: structuredClone(DEFAULT_RELATIONS),
            suspicion: normalizeSuspicionMap(),
            visits: {},
            clues: [],
            items: [],
            keyChoices: {},
            alliances: {},
            npcPositions: {},
            playerPosition: ROLE_DEFS.patrick?.startRoom || "A6",
            deadEntities: [],
            voteLedger: {},
            voteTally: {},
            voteDeaths: [],
            exiledByVote: false,
            flags: {
              meruruDead: false,
              meruruBlessing: false,
              emilyProtected: false,
              patrickBond: false,
              patrickMercy: false,
              patrickAwakened: false,
              karlExposed: 0,
              playerMarked: false,
              voteOutcome: null,
              voteTarget: null,
              voteRevealPending: false,
              truthSeen: 0,
              restUsedSlot: null,
            },
            route: [],
            log: [],
            notice: "QA：低理智表现",
          },
          scene: null,
        };
      }
      if (qa === "vote") {
        return {
          state: {
            screen: "game",
            selectedRole: "patrick",
            slotIndex: SLOT_ORDER.indexOf(VOTE_REVEAL_SLOT),
            phase: "decision",
            scenePage: 0,
            stats: { hp: BASE_HP, mp: BASE_MP, san: 62, truth: 55 },
            maxStats: { hp: BASE_HP, mp: BASE_MP, san: MAX_SAN, truth: MAX_TRUTH },
            generators: { progress: 4, words: PASSWORD_WORDS.slice(0, 4) },
            relations: Object.fromEntries(Object.keys(ENTITIES).map((id) => [id, id === "karl" ? -20 : id === "emily" ? 18 : 0])),
            suspicion: normalizeSuspicionMap(),
            visits: {},
            clues: [],
            items: [],
            keyChoices: { vote_target: "crowd" },
            alliances: {},
            npcPositions: {},
            playerPosition: ROLE_DEFS.patrick?.startRoom || "A6",
            deadEntities: [],
            voteLedger: {
              player: "karl",
              meruru: "patrick",
              karl: "patrick",
              emily: "patrick",
              fan: "patrick",
              ziche: "patrick",
              yamada: "patrick",
              debora: "patrick",
              anjie: "patrick",
            },
            voteTally: { patrick: 8, karl: 1 },
            voteDeaths: ["patrick"],
            exiledByVote: true,
            flags: {
              meruruDead: false,
              meruruBlessing: false,
              emilyProtected: false,
              patrickBond: true,
              patrickMercy: false,
              patrickAwakened: true,
              karlExposed: 1,
              playerMarked: false,
              voteOutcome: "投票放逐",
              voteTarget: "crowd",
              voteRevealPending: false,
              truthSeen: 2,
              restUsedSlot: null,
            },
            route: [],
            log: [],
            notice: "QA：投票放逐",
          },
          scene: null,
        };
      }
      if (qa === "vote-safe") {
        return {
          state: {
            screen: "game",
            selectedRole: "anjie",
            slotIndex: SLOT_ORDER.indexOf(VOTE_REVEAL_SLOT),
            phase: "decision",
            scenePage: 0,
            stats: { hp: 8, mp: 4, san: 36, truth: 64 },
            maxStats: { hp: BASE_HP, mp: BASE_MP, san: MAX_SAN, truth: MAX_TRUTH },
            generators: { progress: 4, words: PASSWORD_WORDS.slice(0, 4) },
            relations: Object.fromEntries(Object.keys(ENTITIES).map((id) => [id, id === "patrick" ? 18 : id === "emily" ? 12 : id === "karl" ? -18 : 0])),
            suspicion: normalizeSuspicionMap(),
            visits: {},
            clues: [],
            items: [],
            keyChoices: { vote_target: "karl" },
            alliances: {},
            npcPositions: {},
            playerPosition: ROLE_DEFS.anjie?.startRoom || "A5",
            deadEntities: ["karl"],
            voteLedger: {
              player: "karl",
              meruru: "karl",
              patrick: "karl",
              emily: "karl",
              fan: "karl",
              ziche: "karl",
              yamada: "karl",
              debora: "karl",
              anjie: "karl",
            },
            voteTally: { karl: 8, anjie: 1 },
            voteDeaths: ["karl"],
            exiledByVote: false,
            flags: {
              meruruDead: true,
              meruruBlessing: false,
              emilyProtected: true,
              patrickBond: true,
              patrickMercy: false,
              patrickAwakened: false,
              karlExposed: 2,
              playerMarked: false,
              voteOutcome: "卡尔",
              voteTarget: "karl",
              voteRevealPending: false,
              truthSeen: 64,
              restUsedSlot: null,
            },
            route: [],
            log: [],
            notice: "QA：票型公开（存活）",
          },
          scene: null,
        };
      }
      if (qa === "vote-tie") {
        return {
          state: {
            screen: "game",
            selectedRole: "patrick",
            slotIndex: SLOT_ORDER.indexOf(VOTE_REVEAL_SLOT),
            phase: "decision",
            scenePage: 0,
            stats: { hp: 6, mp: 3, san: 41, truth: 68 },
            maxStats: { hp: BASE_HP, mp: BASE_MP, san: MAX_SAN, truth: MAX_TRUTH },
            generators: { progress: 3, words: PASSWORD_WORDS.slice(0, 3) },
            relations: Object.fromEntries(Object.keys(ENTITIES).map((id) => [id, id === "karl" ? -18 : id === "emily" ? 16 : 0])),
            suspicion: normalizeSuspicionMap(),
            visits: {},
            clues: [],
            items: [],
            keyChoices: { vote_target: "karl" },
            alliances: {},
            npcPositions: {},
            playerPosition: ROLE_DEFS.patrick?.startRoom || "A6",
            deadEntities: ["karl"],
            voteLedger: {
              player: "karl",
              meruru: "patrick",
              karl: "patrick",
              emily: "karl",
              fan: "karl",
              ziche: "patrick",
              yamada: "patrick",
              debora: "karl",
              anjie: "karl",
            },
            voteTally: { patrick: 4, karl: 4 },
            voteDeaths: ["patrick", "karl"],
            exiledByVote: true,
            flags: {
              meruruDead: true,
              meruruBlessing: false,
              emilyProtected: true,
              patrickBond: true,
              patrickMercy: false,
              patrickAwakened: true,
              karlExposed: 2,
              playerMarked: false,
              voteOutcome: "投票放逐",
              voteTarget: "karl",
              voteRevealPending: false,
              truthSeen: 68,
              restUsedSlot: null,
            },
            route: [],
            log: [],
            notice: "QA：平票放逐",
          },
          scene: null,
        };
      }
      if (qa === "late-slot") {
        return {
          state: {
            screen: "game",
            selectedRole: "yamada",
            slotIndex: SLOT_ORDER.indexOf("5.3"),
            phase: "decision",
            scenePage: 0,
            stats: { hp: 5, mp: 2, san: 28, truth: 78 },
            maxStats: { hp: BASE_HP, mp: BASE_MP, san: MAX_SAN, truth: MAX_TRUTH },
            generators: { progress: 4, words: PASSWORD_WORDS.slice(0, 4) },
            relations: Object.fromEntries(Object.keys(ENTITIES).map((id) => [id, id === "emily" ? 18 : id === "patrick" ? 10 : 0])),
            suspicion: normalizeSuspicionMap(),
            visits: {},
            clues: [],
            items: [],
            keyChoices: {},
            alliances: {},
            npcPositions: {},
            playerPosition: ROLE_DEFS.yamada?.startRoom || "A3",
            deadEntities: ["karl"],
            voteLedger: {},
            voteTally: {},
            voteDeaths: ["karl"],
            exiledByVote: false,
            flags: {
              meruruDead: true,
              meruruBlessing: false,
              emilyProtected: true,
              patrickBond: false,
              patrickMercy: false,
              patrickAwakened: true,
              karlExposed: 2,
              playerMarked: false,
              voteOutcome: "卡尔",
              voteTarget: "karl",
              voteRevealPending: false,
              truthSeen: 78,
              restUsedSlot: null,
            },
            route: [],
            log: [],
            notice: "QA：5.x 后段",
          },
          scene: null,
        };
      }
      if (qa === "late-slot-52") {
        return {
          state: {
            screen: "game",
            selectedRole: "fan",
            slotIndex: SLOT_ORDER.indexOf("5.2"),
            phase: "decision",
            scenePage: 0,
            stats: { hp: 6, mp: 3, san: 27, truth: 70 },
            maxStats: { hp: BASE_HP, mp: BASE_MP, san: MAX_SAN, truth: MAX_TRUTH },
            generators: { progress: 4, words: PASSWORD_WORDS.slice(0, 4) },
            relations: Object.fromEntries(Object.keys(ENTITIES).map((id) => [id, id === "emily" ? 14 : id === "patrick" ? 9 : 0])),
            suspicion: normalizeSuspicionMap(),
            visits: {},
            clues: [],
            items: [],
            keyChoices: {},
            alliances: {},
            npcPositions: {},
            playerPosition: ROLE_DEFS.fan?.startRoom || "A1",
            deadEntities: ["karl"],
            voteLedger: {},
            voteTally: {},
            voteDeaths: ["karl"],
            exiledByVote: false,
            flags: {
              meruruDead: true,
              meruruBlessing: false,
              emilyProtected: true,
              patrickBond: false,
              patrickMercy: false,
              patrickAwakened: true,
              karlExposed: 2,
              playerMarked: false,
              voteOutcome: "卡尔",
              voteTarget: "karl",
              voteRevealPending: false,
              truthSeen: 70,
              restUsedSlot: null,
            },
            route: [],
            log: [],
            notice: "QA：5.2 后段",
          },
          scene: null,
        };
      }
      if (qa === "late-slot-54") {
        return {
          state: {
            screen: "game",
            selectedRole: "ziche",
            slotIndex: SLOT_ORDER.indexOf("5.4"),
            phase: "decision",
            scenePage: 0,
            stats: { hp: 4, mp: 2, san: 32, truth: 82 },
            maxStats: { hp: BASE_HP, mp: BASE_MP, san: MAX_SAN, truth: MAX_TRUTH },
            generators: { progress: 4, words: PASSWORD_WORDS.slice(0, 4) },
            relations: Object.fromEntries(Object.keys(ENTITIES).map((id) => [id, id === "anjie" ? 11 : id === "emily" ? 8 : 0])),
            suspicion: normalizeSuspicionMap(),
            visits: {},
            clues: [],
            items: [],
            keyChoices: {},
            alliances: {},
            npcPositions: {},
            playerPosition: ROLE_DEFS.ziche?.startRoom || "A2",
            deadEntities: ["karl"],
            voteLedger: {},
            voteTally: {},
            voteDeaths: ["karl"],
            exiledByVote: false,
            flags: {
              meruruDead: true,
              meruruBlessing: false,
              emilyProtected: false,
              patrickBond: false,
              patrickMercy: false,
              patrickAwakened: true,
              karlExposed: 2,
              playerMarked: false,
              voteOutcome: "卡尔",
              voteTarget: "karl",
              voteRevealPending: false,
              truthSeen: 82,
              restUsedSlot: null,
            },
            route: [],
            log: [],
            notice: "QA：5.4 终局前线",
          },
          scene: null,
        };
      }
      if (qa === "partial-generator") {
        return {
          state: {
            screen: "game",
            selectedRole: "debora",
            slotIndex: SLOT_ORDER.indexOf("5.3"),
            phase: "result",
            scenePage: 0,
            stats: { hp: 3, mp: 5, san: 30, truth: 84 },
            maxStats: { hp: BASE_HP, mp: BASE_MP, san: MAX_SAN, truth: MAX_TRUTH },
            generators: { progress: 1, words: PASSWORD_WORDS.slice(0, 1) },
            relations: Object.fromEntries(Object.keys(ENTITIES).map((id) => [id, id === "yamada" ? 12 : 0])),
            suspicion: normalizeSuspicionMap(),
            visits: {},
            clues: [],
            items: [],
            keyChoices: {},
            alliances: {},
            npcPositions: {},
            playerPosition: ROLE_DEFS.debora?.startRoom || "A10",
            deadEntities: [],
            voteLedger: {},
            voteTally: {},
            voteDeaths: [],
            exiledByVote: false,
            flags: {
              meruruDead: true,
              meruruBlessing: false,
              emilyProtected: false,
              patrickBond: false,
              patrickMercy: false,
              patrickAwakened: true,
              karlExposed: 0,
              playerMarked: false,
              voteOutcome: null,
              voteTarget: null,
              voteRevealPending: false,
              truthSeen: 84,
              restUsedSlot: null,
            },
            route: [],
            log: [],
            notice: "QA：部分密码结果页",
          },
          scene: {
            slotId: "5.3",
            cleanLabel: "你把最后的密码交给山田，自己留下断后。",
            location: { name: "D层 · 大门装置区", code: "D3" },
            encounter: { short: "山田" },
            paragraphs: [
              "你把最后确认下来的词交给山田，示意她去碰白门装置。你自己没有跟上，只把更危险的位置留给了自己。",
              "线路被你硬拉回来了一格，可你很清楚，这一步还不够。你带回来的只是一部分密码，不是完整的开门答案。",
            ],
            quote: "“你去开门。我留在这里。”",
            effectChips: ["HP -3", "MP -2", "SAN -12", "真相 +16", "供电推进 +1", "部分密码", "白门不足"],
            summary: "5.3 · 你把最后的密码交给山田，自己留下断后。",
            nextNotice: "QA：部分密码结果页",
            effects: {
              stats: { hp: -3, mp: -2, san: -12, truth: 16 },
              generatorGain: 1,
              addWords: ["OVIS"],
              addClues: [],
              addItems: [],
              relations: { yamada: 12 },
              relationEchoes: {},
              suspicion: [],
              flags: {},
              keyChoices: {},
              alliances: {},
              positions: {},
              notes: [
                "你替山田分担了风险，信任因此被明显抬高。",
                "你把自己留在更危险的位置替别人断后，伤势会先落到你身上。",
                "你推进了发电机，但只摸到了部分线索。",
                "白门条件仍不足。",
              ],
            },
          },
        };
      }
      if (qa === "gen-q") {
        return {
          state: {
            screen: "game",
            selectedRole: "patrick",
            slotIndex: SLOT_ORDER.indexOf("2.3"),
            phase: "decision",
            scenePage: 0,
            stats: { hp: 10, mp: BASE_MP, san: 60, truth: 12 },
            maxStats: { hp: BASE_HP, mp: BASE_MP, san: MAX_SAN, truth: MAX_TRUTH },
            generators: { progress: 1, words: PASSWORD_WORDS.slice(0, 1) },
            relations: Object.fromEntries(Object.keys(ENTITIES).map((id) => [id, id === "karl" ? -6 : 0])),
            suspicion: normalizeSuspicionMap(),
            visits: {},
            clues: [],
            items: [],
            keyChoices: {},
            alliances: {},
            npcPositions: {},
            playerPosition: ROLE_DEFS.patrick?.startRoom || "A6",
            deadEntities: [],
            voteLedger: {},
            voteTally: {},
            voteDeaths: [],
            exiledByVote: false,
            flags: {
              meruruDead: false,
              meruruBlessing: false,
              emilyProtected: false,
              patrickBond: false,
              patrickMercy: false,
              patrickAwakened: false,
              karlExposed: 0,
              playerMarked: false,
              voteOutcome: null,
              voteTarget: null,
              voteRevealPending: false,
              truthSeen: 12,
              restUsedSlot: null,
            },
            route: [],
            log: [],
            notice: "QA：供电推进节点",
          },
          scene: null,
        };
      }
      if (qa === "low-san-result") {
        return {
          state: {
            screen: "game",
            selectedRole: "patrick",
            slotIndex: 0,
            phase: "result",
            scenePage: 0,
            stats: { hp: 4, mp: 5, san: 16, truth: 24 },
            maxStats: { hp: BASE_HP, mp: BASE_MP, san: MAX_SAN, truth: MAX_TRUTH },
            generators: { progress: 1, words: PASSWORD_WORDS.slice(0, 1) },
            relations: structuredClone(DEFAULT_RELATIONS),
            suspicion: normalizeSuspicionMap(),
            visits: {},
            clues: [],
            items: [],
            keyChoices: {},
            alliances: {},
            npcPositions: {},
            playerPosition: ROLE_DEFS.patrick?.startRoom || "A6",
            deadEntities: [],
            voteLedger: {},
            voteTally: {},
            voteDeaths: [],
            exiledByVote: false,
            flags: {
              meruruDead: false,
              meruruBlessing: false,
              emilyProtected: false,
              patrickBond: false,
              patrickMercy: false,
              patrickAwakened: false,
              karlExposed: 0,
              playerMarked: false,
              voteOutcome: null,
              voteTarget: null,
              voteRevealPending: false,
              truthSeen: 24,
              restUsedSlot: null,
            },
            route: [],
            log: [],
            notice: "QA：低理智结果页",
          },
          scene: {
            slotId: "1.1",
            cleanLabel: "你先掏出水晶球，摸清房间气息。",
            location: { name: "A层 · 单人牢房", code: "A6" },
            encounter: { short: "梅露露" },
            paragraphs: [
              "你把水晶球贴到掌心时，房间里先浮起来的不是温度，而是一种太靠近你耳后的呼吸声。",
              "你没有得到定论，只得到一段让理智更难合拢的回响。你知道这一步不算赚，却已经把自己往更深处推了一格。",
            ],
            quote: "你轻声说：“别一下子全靠过来。”",
            effectChips: ["MP -1", "SAN -6", "真相 +12", "错过推进"],
            summary: "1.1 · 你先掏出水晶球，摸清房间气息。",
            nextNotice: "QA：低理智结果页",
            effects: {
              stats: { hp: 0, mp: -1, san: -6, truth: 12 },
              generatorGain: 0,
              addWords: [],
              addClues: [],
              addItems: [],
              relations: {},
              relationEchoes: {},
              suspicion: [],
              flags: {},
              keyChoices: {},
              alliances: {},
              positions: {},
              notes: ["你绕开了本时段最直接的系统推进，后面补进度会更吃紧。"],
            },
          },
        };
      }
      if (qa === "vote-ending") {
        return {
          state: {
            screen: "end",
            finished: true,
            selectedRole: "patrick",
            slotIndex: SLOT_ORDER.indexOf(VOTE_REVEAL_SLOT),
            phase: "decision",
            scenePage: 0,
            stats: { hp: 10, mp: BASE_MP, san: 62, truth: 55 },
            maxStats: { hp: BASE_HP, mp: BASE_MP, san: MAX_SAN, truth: MAX_TRUTH },
            generators: { progress: 4, words: PASSWORD_WORDS.slice(0, 4) },
            relations: Object.fromEntries(Object.keys(ENTITIES).map((id) => [id, id === "karl" ? -20 : id === "emily" ? 18 : 0])),
            suspicion: normalizeSuspicionMap(),
            visits: {},
            clues: [],
            items: [],
            keyChoices: {},
            alliances: {},
            npcPositions: {},
            playerPosition: ROLE_DEFS.patrick?.startRoom || "A6",
            deadEntities: [],
            voteLedger: {},
            voteTally: {},
            voteDeaths: ["patrick"],
            exiledByVote: true,
            flags: {
              meruruDead: false,
              meruruBlessing: false,
              emilyProtected: false,
              patrickBond: true,
              patrickMercy: false,
              patrickAwakened: true,
              karlExposed: 1,
              playerMarked: false,
              voteOutcome: "投票放逐",
              voteTarget: "crowd",
              voteRevealPending: false,
              truthSeen: 55,
              restUsedSlot: null,
            },
            route: [],
            log: [],
            archive: {},
            outcome: { type: "vote", title: "投票放逐结局", text: "票纸先一步决定了你的去向。你没能活到第五小时之后。", note: "投票放逐" },
            notice: "QA：投票放逐结局",
          },
          scene: null,
        };
      }
      if (qa === "vote-ending-tie") {
        return {
          state: {
            screen: "end",
            finished: true,
            selectedRole: "anjie",
            slotIndex: SLOT_ORDER.indexOf(VOTE_REVEAL_SLOT),
            phase: "decision",
            scenePage: 0,
            stats: { hp: 7, mp: 4, san: 35, truth: 64 },
            maxStats: { hp: BASE_HP, mp: BASE_MP, san: MAX_SAN, truth: MAX_TRUTH },
            generators: { progress: 4, words: PASSWORD_WORDS.slice(0, 4) },
            relations: structuredClone(DEFAULT_RELATIONS),
            suspicion: normalizeSuspicionMap(),
            visits: {},
            clues: [],
            items: [],
            keyChoices: {},
            alliances: {},
            npcPositions: {},
            playerPosition: ROLE_DEFS.anjie?.startRoom || "A5",
            deadEntities: ["karl"],
            voteLedger: {},
            voteTally: {},
            voteDeaths: ["anjie", "karl"],
            exiledByVote: true,
            flags: {
              meruruDead: true,
              meruruBlessing: false,
              emilyProtected: false,
              patrickBond: false,
              patrickMercy: false,
              patrickAwakened: false,
              karlExposed: 2,
              playerMarked: false,
              voteOutcome: "投票放逐",
              voteTarget: "karl",
              voteRevealPending: false,
              truthSeen: 64,
              restUsedSlot: null,
            },
            route: [],
            log: [],
            archive: {},
            outcome: { type: "vote", title: "投票放逐结局", text: "你与最高票者一同被留在票面上。疗养院不在乎那是不是平票。", note: "投票放逐" },
            notice: "QA：平票放逐结局",
          },
          scene: null,
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  function normalizeState(input) {
    const base = defaultState();
    const roleId = input?.selectedRole && ROLE_DEFS[input.selectedRole] ? input.selectedRole : null;
    const role = roleId ? ROLE_DEFS[roleId] : null;
    const merged = {
      ...base,
      ...input,
      stats: { ...base.stats, ...(input?.stats || {}) },
      maxStats: role ? { hp: BASE_HP, mp: BASE_MP, san: MAX_SAN, truth: MAX_TRUTH } : { ...base.maxStats, ...(input?.maxStats || {}) },
      generators: { ...base.generators, ...(input?.generators || {}) },
      relations: { ...structuredClone(DEFAULT_RELATIONS), ...(input?.relations || {}) },
      suspicion: normalizeSuspicionMap(input?.suspicion),
      visits: { ...(input?.visits || {}) },
      flags: { ...base.flags, ...(input?.flags || {}) },
      archive: syncArchiveWithMeta(input?.archive || {}),
      items: Array.isArray(input?.items) ? input.items : [],
      keyChoices: { ...(input?.keyChoices || {}) },
      alliances: { ...(input?.alliances || {}) },
      npcPositions: { ...(input?.npcPositions || {}) },
      playerPosition: input?.playerPosition || null,
      deadEntities: Array.isArray(input?.deadEntities) ? input.deadEntities : [],
      voteLedger: { ...(input?.voteLedger || {}) },
      voteTally: { ...(input?.voteTally || {}) },
      voteDeaths: Array.isArray(input?.voteDeaths) ? input.voteDeaths : [],
      exiledByVote: !!input?.exiledByVote,
      route: Array.isArray(input?.route) ? input.route : [],
      log: Array.isArray(input?.log) ? input.log : [],
      undoStack: Array.isArray(input?.undoStack) ? input.undoStack : [],
    };
    merged.screen = ["title", "select", "archive", "game", "end", "truth"].includes(merged.screen) ? merged.screen : "title";
    merged.phase = merged.phase === "result" ? "result" : "decision";
    merged.overlay = ["log", "save"].includes(merged.overlay) ? merged.overlay : null;
    merged.scenePage = clamp(Number(merged.scenePage || 0), 0, 99);
    merged.truthCollectionId = typeof input?.truthCollectionId === "string" ? input.truthCollectionId : null;
    merged.truthPageIndex = clamp(Number(merged.truthPageIndex || 0), 0, 999);
    merged.epilogueActIndex = clamp(Number(merged.epilogueActIndex || 0), 0, 3);
    merged.epilogueFast = !!input?.epilogueFast;
    merged.galleryEnding = input?.galleryEnding && typeof input.galleryEnding.roleId === "string" && typeof input.galleryEnding.key === "string"
      ? { roleId: input.galleryEnding.roleId, key: input.galleryEnding.key }
      : null;
      if (role) {
      merged.selectedRole = roleId;
      merged.maxStats.hp = BASE_HP;
      merged.maxStats.mp = BASE_MP;
      merged.maxStats.san = MAX_SAN;
      merged.maxStats.truth = MAX_TRUTH;
      merged.stats.hp = clamp(merged.stats.hp, 0, merged.maxStats.hp);
      merged.stats.mp = clamp(merged.stats.mp, 0, merged.maxStats.mp);
    } else {
      merged.selectedRole = null;
      if (merged.screen === "game" || merged.screen === "end" || merged.screen === "select") merged.screen = "title";
      merged.phase = "decision";
      merged.scene = null;
    }
    merged.slotIndex = clamp(Number(merged.slotIndex || 0), 0, SLOT_ORDER.length - 1);
    merged.generators.progress = clamp(Number(merged.generators.progress || 0), 0, 4);
    merged.generators.words = Array.isArray(merged.generators.words) ? merged.generators.words.slice(0, 4) : [];
    merged.stats.san = clamp(Number(merged.stats.san || 0), 0, MAX_SAN);
    merged.stats.truth = clamp(Number(merged.stats.truth || 0), 0, MAX_TRUTH);
    merged.relations = Object.fromEntries(
      Object.entries(merged.relations || {}).map(([id, value]) => [id, clamp(Number(value || 0), RELATION_MIN, RELATION_MAX)]),
    );
    delete merged.stats.fatigue;
    delete merged.stats.exposure;
    delete merged.stats.alertness;
    merged.items = [...new Set(merged.items)];
    merged.clues = [...new Set(Array.isArray(merged.clues) ? merged.clues : [])];
    merged.deadEntities = [...new Set(merged.deadEntities)].filter((id) => ENTITIES[id]);
    merged.voteLedger = Object.fromEntries(
      Object.entries(merged.voteLedger || {}).filter(([id]) => ENTITIES[id] || id === "player"),
    );
    merged.voteTally = Object.fromEntries(
      Object.entries(merged.voteTally || {}).map(([id, count]) => [id, clamp(Number(count || 0), 0, 99)]),
    );
    merged.voteDeaths = [...new Set(merged.voteDeaths)].filter((id) => ENTITIES[id] || id === merged.selectedRole);
    merged.exiledByVote = !!merged.exiledByVote;
    merged.flags.truthSeen = clamp(Number(merged.flags.truthSeen || 0), 0, 100);
    merged.flags.restUsedSlot = merged.flags.restUsedSlot || null;
    delete merged.flags.gateReady;
    if (!merged.scene || !Array.isArray(merged.scene.paragraphs)) {
      merged.scene = null;
      merged.scenePage = 0;
    }
    if (merged.phase === "result" && !merged.scene) {
      merged.phase = "decision";
      merged.notice = merged.notice || "已从旧版存档恢复到本时段开始前，以避免结果页数据缺失导致白屏。";
    }
    merged.playerPosition = merged.playerPosition || ROLE_DEFS[merged.selectedRole || FALLBACK_ROLE_ID]?.startRoom || null;
    merged.npcPositions = normalizeNpcPositions(merged.npcPositions, SLOT_ORDER[merged.slotIndex], merged.selectedRole, merged.playerPosition);
    return merged;
  }

  function initRoleState(roleId) {
    const next = defaultState();
    next.screen = "game";
    next.selectedRole = roleId;
    next.maxStats = { hp: BASE_HP, mp: BASE_MP, san: MAX_SAN, truth: MAX_TRUTH };
    next.stats = {
      hp: BASE_HP,
      mp: BASE_MP,
      san: BASE_SAN,
      truth: 0,
    };
    next.relations = structuredClone(DEFAULT_RELATIONS);
    next.suspicion = normalizeSuspicionMap();
    next.playerPosition = ROLE_DEFS[roleId]?.startRoom;
    next.npcPositions = normalizeNpcPositions({}, SLOT_ORDER[0], roleId, next.playerPosition);
    return next;
  }

  function normalizeSuspicionMap(source = {}) {
    const map = {};
    SUSPICION_SUBJECTS.forEach((observer) => {
      map[observer] = {};
      SUSPICION_SUBJECTS.forEach((subject) => {
        map[observer][subject] = clamp(Number(source?.[observer]?.[subject] || 0), 0, 100);
      });
    });
    return map;
  }

  function normalizeNpcPositions(source = {}, slotId, roleId, playerPosition) {
    const blueprint = SLOT_POSITION_BLUEPRINTS[slotId] || {};
    const merged = { ...blueprint, ...(source || {}) };
    Object.keys(ENTITIES).forEach((id) => {
      if (id === roleId) return;
      if (!merged[id]) {
        merged[id] = blueprint[id] || ROLE_DEFS[id]?.startRoom || "A12";
      }
    });
    if (roleId) {
      merged[roleId] = playerPosition || ROLE_DEFS[roleId]?.startRoom || merged[roleId];
    }
    return merged;
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn(error);
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function loadSlots() {
    try {
      const raw = localStorage.getItem(SLOT_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  function saveSlots(data) {
    try {
      localStorage.setItem(SLOT_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn(error);
    }
  }

  function defaultMeta() {
    return {
      completedRoles: [],
      endingKeysSeen: [],
      truthRouteUnlocked: false,
      truthRouteCompleted: false,
      truthRouteManualUnlock: false,
      titleTruthMode: false,
    };
  }

  function normalizeMeta(input = {}) {
    const completedRoles = [...new Set(Array.isArray(input.completedRoles) ? input.completedRoles : [])].filter((id) => PLAYABLE_ROLE_IDS.includes(id));
    const endingKeysSeen = [...new Set(Array.isArray(input.endingKeysSeen) ? input.endingKeysSeen : [])].filter(Boolean);
    const truthRouteManualUnlock = !!input.truthRouteManualUnlock;
    const titleTruthMode = !!input.titleTruthMode;
    const truthRouteUnlocked = truthRouteManualUnlock || completedRoles.length >= PLAYABLE_ROLE_IDS.length;
    return {
      completedRoles,
      endingKeysSeen,
      truthRouteUnlocked,
      truthRouteCompleted: !!input.truthRouteCompleted,
      truthRouteManualUnlock,
      titleTruthMode,
    };
  }

  function loadMeta() {
    try {
      const raw = localStorage.getItem(META_KEY);
      return normalizeMeta(raw ? JSON.parse(raw) : defaultMeta());
    } catch (error) {
      return defaultMeta();
    }
  }

  function saveMeta(meta) {
    try {
      localStorage.setItem(META_KEY, JSON.stringify(normalizeMeta(meta)));
    } catch (error) {
      console.warn(error);
    }
  }

  function syncArchiveWithMeta(archive = {}) {
    const meta = loadMeta();
    const merged = { ...(archive || {}) };
    meta.completedRoles.forEach((id) => {
      merged[id] = true;
    });
    return merged;
  }

  function recordRouteCompletion(roleId, outcome) {
    if (!PLAYABLE_ROLE_IDS.includes(roleId)) return loadMeta();
    const meta = loadMeta();
    const next = normalizeMeta({
      ...meta,
      completedRoles: [...meta.completedRoles, roleId],
      endingKeysSeen: [...meta.endingKeysSeen, outcome?.key || outcome?.type || "unknown"],
    });
    saveMeta(next);
    return next;
  }

  function markTruthRouteCompleted() {
    const meta = normalizeMeta({ ...loadMeta(), truthRouteCompleted: true });
    saveMeta(meta);
    return meta;
  }

  function manualUnlockTruthRoute() {
    const current = loadMeta();
    const nextTitleTruthMode = !current.titleTruthMode;
    const meta = normalizeMeta({
      ...current,
      titleTruthMode: nextTitleTruthMode,
      truthRouteManualUnlock: nextTitleTruthMode ? true : current.truthRouteManualUnlock,
    });
    saveMeta(meta);
    titlePreviewRoleId = null;
    titleTouchArmedRoleId = null;
    state.truthPageIndex = 0;
    persist();
    render();
  }

  function isTruthRouteUnlocked() {
    return loadMeta().truthRouteUnlocked;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getHpState(currentState = state) {
    const hp = Number(currentState?.stats?.hp || 0);
    const max = Number(currentState?.maxStats?.hp || 1);
    if (hp <= 0) return "dead";
    if (hp / max <= 0.5) return "heavy";
    return "normal";
  }

  function isHeavyInjury(currentState = state) {
    return getHpState(currentState) === "heavy";
  }

  function isDead(currentState = state) {
    return getHpState(currentState) === "dead";
  }

  function getSanState(currentState = state) {
    const san = Number(currentState?.stats?.san || 0);
    if (san <= 0) return "broken";
    if (san < 20) return "truth";
    if (san < 40) return "insight";
    return "normal";
  }

  function isInsane(currentState = state) {
    return getSanState(currentState) === "broken";
  }

  function isTerminalFailure(currentState = state) {
    return isDead(currentState) || isInsane(currentState);
  }

  function getTruthTier(value = state?.stats?.truth || 0) {
    const truth = clamp(Number(value || 0), 0, 100);
    if (truth >= 76) return 4;
    if (truth >= 51) return 3;
    if (truth >= 26) return 2;
    return 1;
  }

  function getTruthTierLabel(value = state?.stats?.truth || 0) {
    const tier = getTruthTier(value);
    if (tier === 4) return "四级：看穿宿命";
    if (tier === 3) return "三级：知晓历史";
    if (tier === 2) return "二级：察觉异常";
    return "一级：一无所知";
  }

  function isPhysicalIntent(intent = {}) {
    if (!intent) return false;
    if ((intent.tags || []).some((tag) => PHYSICAL_TAGS.has(tag))) return true;
    const clean = String(intent.clean || "");
    return PHYSICAL_WORDS.some((word) => clean.includes(word));
  }

  function hasRestedThisSlot(currentState = state, slotId = currentSlotId()) {
    return currentState?.flags?.restUsedSlot === slotId;
  }

  function getMpEmptyNotice(currentState = state) {
    return currentState.stats.mp <= 0 ? "你精疲力竭，现在只想休息。" : "";
  }

  function getHpLabel(currentState = state) {
    const hpState = getHpState(currentState);
    if (hpState === "dead") return "濒死";
    if (hpState === "heavy") return "重伤";
    return "正常";
  }

  function getMpLabel(currentState = state) {
    if (currentState.stats.mp <= 0) return "枯竭";
    if (currentState.stats.mp <= 1) return "见底";
    if (currentState.stats.mp <= Math.max(2, Math.floor(currentState.maxStats.mp / 3))) return "紧绷";
    return "充足";
  }

  function getSanLabel(currentState = state) {
    const sanState = getSanState(currentState);
    if (sanState === "broken") return "疯狂";
    if (sanState === "truth") return "看见真实";
    if (sanState === "insight") return "洞察";
    return "正常";
  }

  function getSanHint(currentState = state) {
    if (getSanState(currentState) === "truth") return "（你看见真实）";
    if (Number(currentState?.stats?.san || 0) < SAN_VISUAL_THRESHOLD) return "（低理智）";
    if (getSanState(currentState) === "insight") return "（出现异常）";
    return "";
  }

  function getTruthDisplay(currentState = state) {
    if (getSanState(currentState) === "truth") return `${currentState.stats.truth} / 100（${getTruthTierLabel(currentState.stats.truth)}）`;
    return "？？？";
  }

  function getTruthHint(currentState = state) {
    return getSanState(currentState) === "truth" ? "（你看见真实）" : "";
  }

  function getOptionDisabledReason(currentState, slotId, intent) {
    if (currentState.phase !== "decision") return "";
    if (intent.tags.includes("rest")) {
      if (hasRestedThisSlot(currentState, slotId)) return "本时段已经休息过了。";
      return "";
    }
    if (currentState.stats.mp <= 0) return "你精疲力竭，现在只想休息。";
    if (currentState.stats.mp < (intent.mpCost || 1)) return `行动力不足，需要 ${intent.mpCost || 1} 点。`;
    if (isHeavyInjury(currentState) && isPhysicalIntent(intent)) return "你伤得太重，无法这么做。";
    return "";
  }

  function getGeneratorNotice(progress) {
    if (progress === 1) return "第一台发电机恢复，灯光短暂稳住了。";
    if (progress === 2) return "第二台发电机恢复，疗养院深处重新传来电流声。";
    if (progress === 3) return "第三台发电机恢复，只差最后一步就能开门。";
    if (progress >= 4) return "第四台发电机恢复，白门终于具备开启条件。";
    return "";
  }

  function getGeneratorOpportunity(roleId, slotId, optionKey) {
    if (!roleId || !slotId || !optionKey) return null;
    return GENERATOR_OPPORTUNITY_INDEX[roleId]?.get(`${slotId}:${optionKey}`) || null;
  }

  function getGeneratorOpportunitiesForSlot(roleId, slotId) {
    const entries = GENERATOR_OPPORTUNITY_PLAN[roleId] || [];
    return entries.filter((entry) => entry.slotId === slotId);
  }

  function scaleTruthGain(amount) {
    const value = Number(amount || 0);
    if (!value) return 0;
    return value * 8;
  }

  function currentRole() {
    return ROLE_DEFS[state.selectedRole] || ROLE_DEFS[FALLBACK_ROLE_ID] || null;
  }

  function currentPresentationRoleId() {
    if (state.selectedRole && CHARACTER_PRESENTATION[state.selectedRole]) return state.selectedRole;
    if (PRESENTATION_ROLE_ORDER.length) return PRESENTATION_ROLE_ORDER[0];
    return FALLBACK_ROLE_ID;
  }

  function isCoarsePointer() {
    return !!(window.matchMedia && window.matchMedia("(hover: none), (pointer: coarse)").matches);
  }

  function getPresentationRole(roleId) {
    const id = roleId || currentPresentationRoleId();
    const present = CHARACTER_PRESENTATION[id] || null;
    if (!present) return null;
    const playable = ROLE_DEFS[id] || null;
    const entity = ENTITIES[id] || {};
    return {
      id,
      kind: present.kind || playable?.kind || entity.kind || "npc",
      name: present.name || playable?.name || entity.name || id,
      shortName: present.shortName || entity.short || playable?.name || id,
      publicRole: present.publicRole || playable?.publicRole || "",
      background: present.background || playable?.background || "",
      secretHint: present.secretHint || playable?.secretHint || "",
      dossier: present.dossier || playable?.dossier || "",
      tags: present.tags || playable?.tags || [],
      soul: present.soul || playable?.soul || "",
      startRoom: present.startRoom || playable?.startRoom || "",
      startRoomLabel: present.startRoomLabel || playable?.startRoom || "",
      introLead: present.introLead || "",
      introBody: present.introBody || "",
      introHint: present.introHint || "",
      previewSlice: present.previewSlice || present.portraitFull || "",
      previewAvailabilityText: present.previewAvailabilityText || (present.startEnabled ? "可进入该角色线路" : "仅供展示 / 暂无可玩线路"),
      portraitFull: present.portraitFull || "",
      paintingOrder: present.paintingOrder || 0,
      paintingHotspot: present.paintingHotspot || null,
      tooltipLabel: present.tooltipLabel || entity.short || playable?.name || id,
      startEnabled: !!present.startEnabled,
      archive: playable?.archive || null,
      playable,
    };
  }

  function listPresentationRoles(mode = "normal") {
    const order = mode === "truth" ? TRUTH_PRESENTATION_ROLE_ORDER : NORMAL_PRESENTATION_ROLE_ORDER;
    return order.map((id) => getPresentationRole(id)).filter(Boolean);
  }

  function currentSlotId() {
    return SLOT_ORDER[state.slotIndex] || SLOT_ORDER[0] || null;
  }

  function currentSlotMeta() {
    const slotId = currentSlotId();
    return slotId ? SLOT_META[slotId] || null : null;
  }

  function unlockedCount() {
    return PLAYABLE_ROLE_IDS.filter((id) => state.archive?.[id] || loadMeta().completedRoles.includes(id)).length;
  }

  function truthCollections() {
    return Array.isArray(TRUTH_ROUTE.collections) ? TRUTH_ROUTE.collections : [];
  }

  function truthEpilogueActs() {
    return Array.isArray(TRUTH_ROUTE.epilogueActs) ? TRUTH_ROUTE.epilogueActs : [];
  }

  function epilogueAudioSrc() {
    return TRUTH_ROUTE.epilogueAudio || "./assets/ui/epilogue-bgm.mp3";
  }

  function ensureEpilogueAudio() {
    const src = epilogueAudioSrc();
    if (!src) return null;
    if (!epilogueAudio || epilogueAudio.getAttribute("src") !== src) {
      if (epilogueAudio?.parentNode) epilogueAudio.parentNode.removeChild(epilogueAudio);
      epilogueAudio = new Audio(src);
      epilogueAudio.setAttribute("src", src);
      epilogueAudio.setAttribute("data-epilogue-audio", "true");
      epilogueAudio.style.display = "none";
      epilogueAudio.loop = true;
      epilogueAudio.volume = 0.28;
      epilogueAudio.preload = "auto";
      epilogueAudio.addEventListener("timeupdate", syncEpilogueAudioUi);
      epilogueAudio.addEventListener("durationchange", syncEpilogueAudioUi);
      epilogueAudio.addEventListener("play", syncEpilogueAudioUi);
      epilogueAudio.addEventListener("pause", syncEpilogueAudioUi);
      document.body.appendChild(epilogueAudio);
    }
    return epilogueAudio;
  }

  function syncEpilogueAudioUi() {
    const audio = epilogueAudio;
    const progress = app.querySelector("[data-epilogue-audio-progress]");
    const toggle = app.querySelector("[data-action='toggle-epilogue-audio']");
    if (progress && audio) {
      const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
      progress.max = duration ? String(Math.round(duration * 1000)) : "1000";
      if (!epilogueAudioSeeking) {
        progress.value = duration ? String(Math.round(audio.currentTime * 1000)) : "0";
      }
    }
    if (toggle && audio) {
      toggle.textContent = audio.paused ? "\u64ad\u653e" : "\u6682\u505c";
      toggle.setAttribute("aria-pressed", audio.paused ? "false" : "true");
    }
  }

  function startEpilogueAudio() {
    const audio = ensureEpilogueAudio();
    if (!audio) return;
    audio.play().catch(() => {
      syncEpilogueAudioUi();
    });
    if (!epilogueAudioTimer) {
      epilogueAudioTimer = window.setInterval(syncEpilogueAudioUi, 500);
    }
  }

  function stopEpilogueAudioTimer() {
    if (epilogueAudioTimer) {
      window.clearInterval(epilogueAudioTimer);
      epilogueAudioTimer = null;
    }
  }

  function pauseEpilogueAudio() {
    if (epilogueAudio) epilogueAudio.pause();
    stopEpilogueAudioTimer();
    syncEpilogueAudioUi();
  }

  function toggleEpilogueAudio() {
    const audio = ensureEpilogueAudio();
    if (!audio) return;
    if (audio.paused) {
      startEpilogueAudio();
    } else {
      audio.pause();
      syncEpilogueAudioUi();
    }
  }

  function seekEpilogueAudio(value) {
    const audio = ensureEpilogueAudio();
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    audio.currentTime = clamp(Number(value || 0) / 1000, 0, audio.duration);
  }

  function seekEpilogueAudioFromPointer(control, event) {
    const audio = ensureEpilogueAudio();
    if (!control || !audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const rect = control.getBoundingClientRect();
    const ratio = rect.width > 0 ? clamp((event.clientX - rect.left) / rect.width, 0, 1) : 0;
    const value = Math.round(audio.duration * 1000 * ratio);
    control.max = String(Math.round(audio.duration * 1000));
    control.value = String(value);
    seekEpilogueAudio(value);
  }

  function pauseEpilogueTextAutoScroll(target) {
    const windowEl = target?.closest?.("[data-epilogue-scroll-window]") || target;
    const stage = windowEl?.closest?.(".epilogue-stage");
    if (!stage) return;
    stage.classList.add("is-user-scrolling");
    if (epilogueTextScrollTimer) window.clearTimeout(epilogueTextScrollTimer);
    epilogueTextScrollTimer = window.setTimeout(() => {
      stage.classList.remove("is-user-scrolling");
      epilogueTextScrollTimer = null;
    }, 3600);
  }

  function truthCollectionById(collectionId = state.truthCollectionId) {
    return truthCollections().find((collection) => collection.id === collectionId) || null;
  }

  function truthRoutePageCount(collectionId = state.truthCollectionId) {
    const collection = truthCollectionById(collectionId);
    if (collection) return Array.isArray(collection.pages) ? collection.pages.length : 0;
    const pages = Array.isArray(TRUTH_ROUTE.pages) ? TRUTH_ROUTE.pages : [];
    const hasEpilogue = Array.isArray(TRUTH_ROUTE.epilogue) && TRUTH_ROUTE.epilogue.length;
    return pages.length + (hasEpilogue ? 1 : 0);
  }

  function renderTruthRouteEntry(location = "title") {
    const meta = loadMeta();
    const completed = meta.completedRoles.length;
    const unlocked = meta.truthRouteUnlocked && truthRoutePageCount() > 0;
    if (!unlocked) return "";
    const className = location === "title" ? "title-truth-entry" : "panel truth-unlock-panel";
    const epilogueButton = location === "title" && truthEpilogueActs().length
      ? `<button class="btn epilogue-entry-btn" data-action="open-epilogue">\u5c3e\u58f0</button>`
      : "";
    return `
      <section class="${className}">
        <div>
          <div class="eyebrow">${meta.truthRouteCompleted ? "文件夹已读完" : "真相路线已解锁"}</div>
          <h2>${TRUTH_ROUTE.title || "埃莉诺的文件夹"}</h2>
          <p>${TRUTH_ROUTE.subtitle || "上帝视角真相路线"} · ${meta.truthRouteManualUnlock ? "标题隐藏入口已启动" : `已完成 ${completed} / ${PLAYABLE_ROLE_IDS.length} 名主角线路`}。</p>
        </div>
        <div class="truth-entry-actions">
          <button class="btn primary" data-action="open-truth">${meta.truthRouteCompleted ? "重读真相路线" : "进入真相路线"}</button>
          ${epilogueButton}
        </div>
      </section>
    `;
  }

  function resetToTitle() {
    pauseEpilogueAudio();
    state.screen = "title";
    state.overlay = null;
    state.phase = state.finished ? "decision" : state.phase;
    state.scenePage = 0;
    state.truthPageIndex = 0;
    state.epilogueFast = false;
    titlePreviewRoleId = null;
    titleTouchArmedRoleId = null;
    persist();
    render();
  }

  function startNew() {
    state = normalizeState(defaultState());
    state.screen = "title";
    titlePreviewRoleId = null;
    titleTouchArmedRoleId = null;
    persist();
    render();
  }

  function resumeLast() {
    const saved = loadState();
    if (!saved?.selectedRole) return;
    state = normalizeState(saved);
    state.overlay = null;
    state.scenePage = state.phase === "result" ? clamp(Number(state.scenePage || 0), 0, 99) : 0;
    state.screen = state.selectedRole ? (state.finished ? "end" : "game") : "title";
    persist();
    render();
  }

  function openTruthRoute() {
    if (!isTruthRouteUnlocked()) return;
    pauseEpilogueAudio();
    state.screen = "truth";
    state.overlay = null;
    state.phase = "decision";
    state.scene = null;
    state.scenePage = 0;
    state.truthCollectionId = null;
    state.truthPageIndex = 0;
    state.epilogueActIndex = 0;
    state.epilogueFast = false;
    persist();
    render();
  }

  function openEpilogue() {
    if (!isTruthRouteUnlocked() || !truthEpilogueActs().length) return;
    state.screen = "truth";
    state.overlay = null;
    state.phase = "decision";
    state.scene = null;
    state.scenePage = 0;
    state.truthCollectionId = EPILOGUE_COLLECTION_ID;
    state.truthPageIndex = 0;
    state.epilogueActIndex = 0;
    state.epilogueFast = false;
    persist();
    render();
    startEpilogueAudio();
  }

  function openTruthCollection(collectionId) {
    if (state.screen !== "truth") return;
    pauseEpilogueAudio();
    const collection = truthCollectionById(collectionId);
    if (!collection) return;
    state.truthCollectionId = collection.id;
    state.truthPageIndex = 0;
    persist();
    render();
  }

  function backTruthIndex() {
    if (state.screen !== "truth") return;
    pauseEpilogueAudio();
    state.truthCollectionId = null;
    state.truthPageIndex = 0;
    state.epilogueFast = false;
    persist();
    render();
  }

  function stepTruthPage(delta) {
    if (state.screen !== "truth") return;
    const collection = truthCollectionById();
    if (!collection) return;
    const total = Math.max(1, truthRoutePageCount(collection.id));
    state.truthPageIndex = clamp(Number(state.truthPageIndex || 0) + delta, 0, total - 1);
    persist();
    render();
  }

  function completeTruthRoute() {
    if (state.screen !== "truth") return;
    markTruthRouteCompleted();
    persist();
    render();
  }

  function continueTruthRoute() {
    stepTruthPage(1);
  }

  function speedEpilogueScroll() {
    if (state.screen !== "truth" || state.truthCollectionId !== EPILOGUE_COLLECTION_ID) return;
    state.epilogueFast = true;
    const stage = app.querySelector(".epilogue-stage");
    const tag = app.querySelector("[data-epilogue-speed-label]");
    const button = app.querySelector("[data-action='speed-epilogue']");
    if (stage) stage.classList.add("is-fast");
    if (tag) tag.textContent = "\u9ad8\u901f\u64ad\u653e";
    if (button) button.disabled = true;
    persist();
  }

  function nextEpilogueAct() {
    if (state.screen !== "truth" || state.truthCollectionId !== EPILOGUE_COLLECTION_ID) return;
    const acts = truthEpilogueActs();
    const lastIndex = Math.max(0, acts.length - 1);
    if (!acts.length) return backTruthIndex();
    if (state.epilogueActIndex < lastIndex) {
      state.epilogueActIndex += 1;
      state.epilogueFast = false;
    } else {
      markTruthRouteCompleted();
      state.truthCollectionId = null;
      state.truthPageIndex = 0;
      state.epilogueActIndex = 0;
      state.epilogueFast = false;
    }
    persist();
    render();
    startEpilogueAudio();
  }

  function openPresentationRole(roleId) {
    if (!roleId || !CHARACTER_PRESENTATION[roleId]) return;
    state.selectedRole = roleId;
    state.screen = "select";
    titlePreviewRoleId = roleId;
    titleTouchArmedRoleId = null;
    persist();
    render();
  }

  function setTitlePreview(roleId) {
    if (roleId === titlePreviewRoleId) return;
    if (roleId && CHARACTER_PRESENTATION[roleId]) {
      titlePreviewRoleId = roleId;
      titlePreviewLockUntil = Date.now() + 180;
    } else {
      titlePreviewRoleId = null;
      titleTouchArmedRoleId = null;
      titlePreviewLockUntil = 0;
    }
    render();
  }

  function titlePreviewLayout(role) {
    const x = Number(role?.paintingHotspot?.labelX || 0);
    return x >= 1920 ? "reverse" : "normal";
  }

  function renderTitleHoverBadge() {
    const previewRole = titlePreviewRoleId ? getPresentationRole(titlePreviewRoleId) : null;
    const hotspot = previewRole?.paintingHotspot;
    if (!previewRole || !hotspot) return "";
    const x = ((Number(hotspot.labelX || 0) / 3840) * 100).toFixed(3);
    const y = ((Number(hotspot.labelY || 0) / 1648) * 100).toFixed(3);
    const anchorClass = hotspot.labelAnchor === "end" ? "end" : hotspot.labelAnchor === "start" ? "start" : "middle";
    return `
      <div class="painting-hover-badge ${anchorClass} ${previewRole.startEnabled ? "is-pc" : "is-npc"}" style="left:${x}%;top:${y}%;">
        <span>${previewRole.shortName}</span>
      </div>
    `;
  }

  function titlePreviewCssVars() {
    const previewRole = titlePreviewRoleId ? getPresentationRole(titlePreviewRoleId) : null;
    const hotspot = previewRole?.paintingHotspot;
    if (!hotspot) return "";
    const x = ((Number(hotspot.labelX || 0) / 3840) * 100).toFixed(3);
    return `--preview-focus-x:${x}%;`;
  }

  function renderTitlePreviewBand() {
    const previewRole = titlePreviewRoleId ? getPresentationRole(titlePreviewRoleId) : null;
    const emptyPrompt = TITLE_PRESENTATION.emptyPrompt || "将光标停在画中人物上，或轻触人物查看预览。";
    if (!previewRole) {
      return `
        <section class="title-preview-band is-empty" data-title-preview-band aria-live="polite">
          <div class="title-preview-empty">${emptyPrompt}</div>
        </section>
      `;
    }
    const reverse = titlePreviewLayout(previewRole) === "reverse";
    const bandStyle = titlePreviewCssVars();
    return `
      <section class="title-preview-band ${reverse ? "reverse" : "normal"} ${previewRole.startEnabled ? "is-pc" : "is-npc"}" data-title-preview-band aria-live="polite" style="${bandStyle}">
        <div class="title-preview-slice-wrap ${previewRole.startEnabled ? "" : "npc-muted"}">
          <div class="title-preview-slice-glow"></div>
          <img class="title-preview-slice" src="${previewRole.previewSlice}" alt="${previewRole.name} 预览切片" />
        </div>
        <div class="title-preview-copy">
          <div class="title-preview-kicker">${previewRole.startEnabled ? "可操作角色" : "剧情展示角色"}</div>
          <div class="title-preview-line title-preview-name">${previewRole.name}</div>
          <div class="title-preview-line title-preview-role">${previewRole.publicRole}</div>
          <div class="title-preview-line title-preview-tags">${previewRole.tags.join(" / ")}</div>
          <div class="title-preview-line title-preview-hook">${previewRole.introLead}</div>
          <div class="title-preview-line title-preview-status">${previewRole.previewAvailabilityText}</div>
        </div>
      </section>
    `;
  }

  function beginRole(roleId) {
    if (!ROLE_DEFS[roleId]) return;
    state = normalizeState(initRoleState(roleId));
    state.notice = buildIntroNotice(roleId);
    state.autosave = true;
    persist();
    render();
  }

  function buildIntroNotice(roleId) {
    if (roleId === "fan") return "对讲机里那个弱气女声已经把“恶狼”的身份递到你手里。你不打算照她的名字来理解自己。";
    if (roleId === "ziche") return "房门、墙角和红灯都先被你算进逃生路线。你还没相信任何人，也还不需要。";
    if (roleId === "yamada") return "你先把表情调成最合适的样子，再决定该把哪一部分真实藏进袖口里。";
    if (roleId === "anjie") return "你把笔记本摊开在膝上，像是在给一场迟到的自证准备证据。";
    if (roleId === "debora") return "你知道“装成无害”比“装成强大”更容易让人忽略真正的危险。";
    return "你已经听见这栋楼最轻的那层回声了。先别急着解释，先记住它是从哪边贴过来的。";
  }

  function getRoleOptions(roleId, slotId) {
    const fromDoc = BASE_OPTIONS?.[roleId]?.[slotId];
    if (fromDoc) return fromDoc;
    return {
      A: "前往你认为最关键的地点，主动推进线索。",
      B: "与最值得注意的人接触，尝试改变关系。",
      C: "**【休息】** 暂停动作，整理思路，听任别处的事件先一步发生。",
    };
  }

  function getOptionModule(roleId, slotId, optionKey) {
    return OPTION_MODULES?.[roleId]?.[slotId]?.[optionKey] || null;
  }

  function compileOptionModules(baseOptions) {
    const modules = {};
    Object.entries(baseOptions || {}).forEach(([roleId, slots]) => {
      modules[roleId] = {};
      Object.entries(slots || {}).forEach(([slotId, options]) => {
        modules[roleId][slotId] = {};
        Object.entries(options || {}).forEach(([optionKey, label]) => {
          modules[roleId][slotId][optionKey] = createOptionModule(roleId, slotId, optionKey, label);
        });
      });
    });
    return modules;
  }

  function createOptionModule(roleId, slotId, optionKey, label) {
    const clean = stripRestLabel(label);
    const targets = findTargets(clean);
    const location = findLocation(clean, slotId);
    const tags = deriveTags(clean, optionKey);
    return {
      id: `${roleId}:${slotId}:${optionKey}`,
      roleId,
      slotId,
      optionKey,
      rawLabel: label,
      cleanLabel: clean,
      location,
      targets,
      tags,
      branchClass: classifyBranch(tags, clean, slotId),
      urgency: inferUrgency(tags, clean, slotId),
      focus: inferFocus(clean, targets, location, tags),
      memoryHooks: inferMemoryHooks(clean, tags, targets, location),
      proseHooks: inferProseHooks(clean, tags, targets, location),
      motifs: inferNarrativeMotifs(clean, tags, targets, location, slotId),
    };
  }

  function deriveTags(clean, optionKey) {
    const tags = [];
    if (optionKey === "C" || clean.includes("休息")) tags.push("rest");
    if (/发电机|电闸|电源|供电|电线|线路|破译|密码/.test(clean)) tags.push("generator");
    if (/交谈|询问|安慰|祝福|祈祷|告解|劝告|坦诚|结盟|递给|告诉|靠近|搭话|试图理解|按手/.test(clean)) tags.push("social");
    if (/攻击|炸|破坏|挡住|断后|开枪|威胁|划伤|弄伤|逼迫|拖延|同归于尽/.test(clean)) tags.push("attack");
    if (/展示|公开|发表|演说|宣布|分享|主导叙事|辩护|指控|质问/.test(clean)) tags.push("public");
    if (/观察|检查|搜索|调查|寻找|发现|聆听|偷听|记录|回想|整理|分析|占卜|通灵/.test(clean)) tags.push("investigate");
    if (/匕首|眼球|戒指|日记|遗言|手链|病历|书籍|对讲机/.test(clean)) tags.push("item");
    if (/投票|投给|弃权|辩论|处刑/.test(clean)) tags.push("vote");
    if (/帮助|保护|护送|守护|照顾|安抚|留下来帮助/.test(clean)) tags.push("protect");
    if (/祈祷|圣经|主啊|主的声音|亡魂|通灵|占卜|仪式|灵魂|母神/.test(clean)) tags.push("occult");
    return tags;
  }

  function classifyBranch(tags, clean, slotId) {
    if (slotId === STORY_ANCHORS.finalVote) return "verdict";
    if (slotId === "5.4") return "ending";
    if (tags.includes("rest")) return "rest";
    if (tags.includes("attack")) return "conflict";
    if (tags.includes("generator")) return "system";
    if (tags.includes("social") || tags.includes("protect")) return "encounter";
    if (tags.includes("investigate") || tags.includes("item")) return "discovery";
    if (slotId === STORY_ANCHORS.secondGather || slotId === STORY_ANCHORS.meruruDeath || slotId === STORY_ANCHORS.patrickAwakening) return "anchor";
    return "exploration";
  }

  function inferUrgency(tags, clean, slotId) {
    let value = 1;
    if (tags.includes("attack") || tags.includes("vote")) value += 2;
    if (tags.includes("generator") || tags.includes("protect")) value += 1;
    if (slotId === STORY_ANCHORS.meruruDeath || slotId === STORY_ANCHORS.finalVote || slotId === STORY_ANCHORS.patrickAwakening) value += 2;
    if (/立刻|马上|直接|毫不犹豫|冲向/.test(clean)) value += 1;
    return clamp(value, 1, 5);
  }

  function inferFocus(clean, targets, location, tags) {
    if (targets.length) return `人物:${targets.map((id) => ENTITIES[id]?.short || id).join("/")}`;
    if (tags.includes("generator")) return "系统:发电机";
    if (tags.includes("vote")) return "系统:投票";
    if (tags.includes("rest")) return "内心:休息";
    if (location?.code) return `地点:${location.code}`;
    return "局势:泛化";
  }

  function formatFocusLabel(focus) {
    if (!focus) return "";
    const [type, rawValue = ""] = String(focus).split(":");
    if (type === "人物") {
      const names = rawValue
        .split("/")
        .filter(Boolean)
        .map((token) => ENTITIES[token]?.short || token);
      return names.length ? `人物 · ${names.join(" / ")}` : "人物 · 未知";
    }
    if (type === "地点") return `地点 · ${rawValue}`;
    if (type === "系统") return `系统 · ${rawValue}`;
    if (type === "内心") return `内心 · ${rawValue}`;
    if (type === "局势") return `局势 · ${rawValue}`;
    return String(focus).replace(/:/g, " · ");
  }

  function compactDecisionLabel(roleId, slotId, label, optionKey = "") {
    const clean = stripRestLabel(label);
    const isRest = /【休息】/.test(clean);
    const restMap = {
      fan: {
        "1.1": "抱紧十字架祈祷",
        "1.2": "躲角落默祷",
        "1.3": "背诵羔羊经文",
        "1.4": "为众人默念主祷文",
        "2.1": "黑暗里做告解",
        "2.2": "写赦免名单",
        "2.3": "伏地承受试炼",
        "2.4": "离群做苦路善工",
        "3.1": "躲进黑暗崩溃",
        "3.2": "沉进圣母幻象",
        "3.3": "背诵亲族名字",
        "3.4": "虚脱瘫在长椅",
        "4.1": "石桌前长祷",
        "4.2": "请子车判你是否该死",
        "4.3": "闭眼进入恍惚",
        "4.4": "蜷缩承受结果",
        "5.1": "站在原地哭到失声",
        "5.2": "倒地等候裁决",
        "5.3": "抱圣经闭眼等待",
        "5.4": "站在白门前不挣扎",
      },
      ziche: {
        "1.1": "闭眼听门外动静",
        "1.2": "坐远端盯死全场",
        "1.3": "靠墙给旧伤换药",
        "1.4": "磨尖铁棍",
        "2.1": "清点手里所有武器",
        "2.2": "胡乱给伤口涂药",
        "2.3": "画逃跑路线图",
        "2.4": "练到一抽就能出棍",
        "3.1": "站在尸体旁算威胁",
        "3.2": "躲进监控房查录像",
        "3.3": "坐进救护车闭眼缓气",
        "3.4": "画防迷路标记",
        "4.1": "门外擦武器柄",
        "4.2": "重排全身负重顺序",
        "4.3": "闭眼养神不松棍",
        "4.4": "收紧装备等着狂奔",
        "5.1": "站住一秒算怪物速度",
        "5.2": "停下来压住喘息",
        "5.3": "翻路线本发现无路可走",
        "5.4": "回头把地狱刻进脑子",
      },
      yamada: {
        "1.1": "对墙发呆戴回面具",
        "1.2": "装发呆给所有人打分",
        "1.3": "装睡偷听路过谈话",
        "1.4": "远远守着艾米莉",
        "2.1": "装发呆监视进出",
        "2.2": "躲进暗处独自坐一会",
        "2.3": "摊开纸条拼逻辑链",
        "2.4": "离群压回暴力念头",
        "3.1": "盯着尸体掐住掌心",
        "3.2": "靠冰柜强行冷静",
        "3.3": "靠墙露出真实疲态",
        "3.4": "蜷起身体短暂崩溃",
        "4.1": "低头刮着椅扶手",
        "4.2": "贴着艾米莉取暖",
        "4.3": "攥拳到掌心见血",
        "4.4": "背身无声掉泪",
        "5.1": "僵住却不松开她的手",
        "5.2": "坐在冰柜旁听惨叫",
        "5.3": "按着胸口忍住崩塌",
        "5.4": "靠门坐下等最后时刻",
      },
      debora: {
        "1.1": "捂脸假哭观察房间",
        "1.2": "缩在椅上偷听关键词",
        "1.3": "陷进沙发装累",
        "1.4": "抱着干粮埋头猛吃",
        "2.1": "躺在沙发上真睡过去",
        "2.2": "靠墙哼跑调老歌",
        "2.3": "盖住脸蜷成一团",
        "2.4": "在炉火边打盹",
        "3.1": "在尸体旁守着悲伤",
        "3.2": "盯着破洞发作头痛",
        "3.3": "坐湖边看陌生倒影",
        "3.4": "站在门前沉默想密码",
        "4.1": "胃疼蜷着等审判",
        "4.2": "翻出口袋硬吞胃药",
        "4.3": "摸着对讲机终究没开口",
        "4.4": "瘫在椅上被抽空",
        "5.1": "跪地失去腿上的力",
        "5.2": "隔着车窗看清自己",
        "5.3": "写下账户密码清单",
        "5.4": "坐在门外台阶看天塌",
      },
      patrick: {
        "2.4": "独自在灯影里缓慢调息",
      },
    };
    if (isRest) {
      return ensureSecondPersonChoice(restMap[roleId]?.[slotId] || clean.replace(/^【休息】\s*/, ""));
    }
    const compactMap = {
      patrick: {
        "2.4": {
          A: "拆读四个拉丁词的死意",
          B: "把灵感交给安洁校准",
        },
      },
      fan: {
        "1.2": {
          A: "安抚大厅里最恐惧的人",
          B: "研究被亵渎的晚餐壁画",
        },
        "1.3": {
          B: "靠近卡尔问他如何背罪",
        },
        "1.4": {
          A: "把眼球当圣物低声交谈",
          B: "问人要不要替他祈祷",
        },
        "2.1": {
          B: "用身体隔开争吵双方",
        },
        "2.2": {
          A: "拿戒指出去讲罪与牧羊人",
        },
        "2.3": {
          B: "抓住敌意者低声说原谅",
        },
        "2.4": {
          A: "把异象解释成主的考验",
        },
        "3.1": {
          A: "在尸体旁长跪诵安魂祷文",
          B: "模仿受难姿态露出掌伤",
        },
        "3.2": {
          A: "公开主张凶手也该被宽恕",
          B: "故意弄伤自己维持清醒",
        },
        "3.3": {
          B: "去 D3 门外仰望异象",
        },
        "3.4": {
          A: "逐个做临终关怀式交谈",
        },
        "4.1": {
          A: "演说并暗示自己该受死",
        },
        "4.2": {
          A: "用经文回应所有怀疑",
          B: "把眼球摆上桌当见证",
        },
        "4.3": {
          A: "请求派翠克用你的血",
        },
        "5.2": {
          A: "主动提议拿自己当诱饵",
        },
        "5.3": {
          A: "把密码和物品全交给子车",
        },
      },
      debora: {
        "1.3": {
          A: "去 A19 装找食物摸工具",
        },
        "2.1": {
          A: "挑安全路线反复装怕死",
          B: "在 A14 见血后夸张干呕",
        },
        "2.4": {
          A: "装笨追问几个关键问题",
        },
        "3.1": {
          A: "听死讯后愣住再失声哭",
        },
        "3.2": {
          A: "装作跟不上推理只会着急",
        },
        "4.1": {
          A: "沉默挨审后才可怜辩解",
        },
        "4.2": {
          B: "承认隐瞒对讲机损坏",
        },
        "5.3": {
          A: "把最后密码交给山田",
        },
      },
    };
    const mapped = compactMap[roleId]?.[slotId]?.[optionKey];
    if (mapped) return ensureSecondPersonChoice(mapped);
    const tokenMap = [
      [/在大厅集会时.*瘫坐在椅子上.*附和别人/, "大厅瘫坐附和"],
      [/对所有看起来很强势的人.*往后躲/, "躲开强势的人"],
      [/如果遇到别人.*阿姨我年纪大了.*待着/, "装老躲着"],
      [/如果遇到其他人.*阿姨我年纪大了.*待着/, "装老躲着"],
      [/听到梅露露的死讯后.*寻找凶器.*痕迹/, "先查死讯现场"],
      [/听到梅露露的死讯后.*开始哭/, "听死讯后哭"],
      [/在追查凶手的过程中.*跟不上.*干着急/, "跟不上推理"],
      [/当子车突然指认卡尔时.*劝双方冷静/, "劝双方冷静"],
      [/开始劝说他人.*不要被仇恨蒙蔽/, "劝愤怒的人"],
      [/如果有人对她表现出明显的敌意.*我原谅你/, "靠近敌意者说原谅"],
      [/公开将自己找到的“眼球”放在桌子中央.*胡言乱语/, "摆眼球当见证"],
      [/主动承担破译发电机的任务|协助破译发电机|参与破译发电机/, "破译发电机"],
      [/在大厅集会时.*观察所有人的互动|观察所有人的互动|用余光扫视每一个人/, "观察大厅众人"],
      [/主动与看起来最没攻击性的艾米莉搭话|跟在艾米莉身后|紧跟在艾米莉身边/, "靠近艾米莉"],
      [/独自前往A18.*藏书馆|前往A18.*藏书馆|顺着那股异气翻书/, "去藏书馆查资料"],
      [/发现卡尔在逼问梅露露.*偷听|偷听.*梅露露/, "偷听卡尔与梅露露"],
      [/主动找到子车.*交换房间分布的情报|找到子车.*交换/, "找子车换情报"],
      [/只分享部分情报.*隐瞒.*戒指/, "藏下戒指线索"],
      [/找到艾米莉.*别乱说话/, "命令艾米莉跟紧你"],
      [/听到梅露露的死讯后.*开始分析/, "听死讯后先算阵营"],
      [/挽住艾米莉的手|抓起艾米莉的手腕|拉着艾米莉/, "拉住艾米莉逃生"],
      [/诱导式的方式提问|不会直接指控/, "诱导众人自己说出怀疑"],
      [/频繁地与持有对讲机的人保持联系/, "搭建对讲机情报网"],
      [/检查车门和车钥匙|仔细检查车门和车钥匙/, "检查救护车"],
      [/进行最后的游说|最后的自由时间.*布局/, "投票前最后游说"],
      [/将时间线证据公之于众|巧妙地将嫌疑锁定/, "公开时间线证据"],
      [/找塔比瑟.*带艾米莉走/, "托塔比瑟带走艾米莉"],
      [/说出关于他妻子珍妮的真相/, "揭出珍妮真相逼卡尔失控"],
      [/在所有人的脑海中播放.*录音/, "播放罗伯特录音"],
      [/投给了卡尔/, "把票投给卡尔"],
      [/选择了弃权/, "拒绝参与这场投票"],
      [/选择了一个与主要人群相反的方向跑|用声音和敲击制造混乱/, "反向引怪替人群断路"],
      [/推倒书柜制造障碍/, "推倒书柜躲进壁炉后"],
      [/将对讲机开到最大音量.*扔进B2/, "扔下对讲机制造坠落假象"],
      [/试图用.*救护车作为掩体/, "躲进救护车后观察"],
      [/向着派翠克大喊.*引到远离艾米莉/, "大喊引怪离开艾米莉"],
      [/将她推向那片白光/, "把艾米莉推进白门"],
      [/戴上它.*独自一人/, "戴上红绳独自走向门"],
      [/惊慌失措地拍打电子闸门/, "拍门呼救装崩溃"],
      [/对讲机广播时.*老阿姨|没用的程序员/, "对讲机里装无害阿姨"],
      [/独自前往A19.*找吃的|确认.*武器或工具/, "去储物室摸工具"],
      [/冲上去打圆场/, "冲上去给梅露露圆场"],
      [/主动提出照顾.*安洁/, "主动留在安洁身边"],
      [/选择了一条看似安全.*路线/, "挑近大厅的安全路线"],
      [/夸张的干呕和恐惧/, "在血迹前装到不敢前进"],
      [/在大家激烈讨论时.*尴尬地陪着笑脸/, "在旁边陪笑装外行"],
      [/提出暴力方案时.*和和气气/, "劝人别动火气"],
      [/被分配去协助破译发电机.*束手无策/, "在发电机前装不会"],
      [/停电.*发出最尖锐的惊叫/, "停电时抓住最近的人尖叫"],
      [/追问.*神.*吃人吗/, "追问神会不会吃人"],
      [/大家.*分头行动时.*反对/, "反对大家分头行动"],
      [/讲述生命的无常|不要再互相猜忌/, "哭过后劝众人别再互猜"],
      [/公开.*专业素养|专业术语分析/, "突然暴露爆破专业素养"],
      [/突然转变表示惊讶.*废物阿姨/, "装傻把专业话圆回去"],
      [/试图找到子车.*寻求对方的意见/, "去问子车该信谁"],
      [/破解对讲机的频道/, "破解对讲机私密频道"],
      [/始终保持沉默.*可怜兮兮/, "沉默到矛头指向自己"],
      [/始终保持沉默.*为自己辩解/, "沉默挨审后再小声辩解"],
      [/默默地流眼泪.*故事而动容/, "在旁落泪看卡尔挨质问"],
      [/眼神一直在躲闪.*不敢与任何人对视/, "躲着视线听完指控"],
      [/曾经隐瞒了对讲机损坏/, "承认隐瞒对讲机损坏"],
      [/小声地问旁边的子车/, "悄悄问子车该投谁"],
      [/轻轻地拉住卡尔的衣袖/, "拉住卡尔别再失控"],
      [/选择了卡尔/, "按逻辑把票投给卡尔"],
      [/选择了派翠克/, "把票投给派翠克"],
      [/冲到A20.*确认.*梅露露的尸体/, "回头确认梅露露尸体"],
      [/死死抓着子车/, "死死抓住子车求活"],
      [/主动担任破解最后一台发电机的任务/, "去破最后一台发电机"],
      [/制作燃烧瓶/, "现场做燃烧瓶"],
      [/将最后的密码告诉山田.*我留在这里断后/, "把密码交给山田自己断后"],
      [/捡起他掉落的武器/, "捡起遗武硬撑着面对怪物"],
      [/最后一个踏进那片白光/, "最后一个穿过白门"],
      [/转身去接应/, "回头接应没到的人"],
      [/仔细检查对讲机.*神学/, "对讲机里追问神学"],
      [/冗长.*祷告|进行一段.*祷告/, "跪地做长祷"],
      [/主动走向看起来最恐惧的人/, "安抚最恐惧的人"],
      [/仔细观察.*最后的晚餐.*壁画/, "研究亵渎壁画"],
      [/前往A14.*默想之地/, "去审讯室默想痛苦"],
      [/接近.*卡尔.*承担这罪/, "对卡尔说愿替他背罪"],
      [/将其视为某种圣物/, "捧着眼球当圣物"],
      [/找到子车或狄波拉.*为他们祈祷/, "问别人要不要为其祈祷"],
      [/前往A21.*焚烧房/, "去焚烧房寻求净化"],
      [/主动上前介入.*爱你的仇敌/, "用身体拦下争吵双方"],
      [/展示.*狼群永存.*戒指/, "拿戒指出去讲罪与牧羊人"],
      [/尝试与梅露露交谈/, "向梅露露确认治愈是否神迹"],
      [/将一切超自然现象解释为/, "把超自然都讲成考验"],
      [/通过按手祷告/, "按手替安洁祈祷"],
      [/在尸体旁长时间跪下/, "在尸体旁反复诵安魂祷文"],
      [/模仿耶稣受难前的姿态/, "模仿受难姿态"],
      [/发表一些关于.*杀人者也是可怜的罪人/, "公开主张凶手也该被宽恕"],
      [/找到一些尖锐的物品.*弄伤自己/, "故意弄伤自己保持清醒"],
      [/劝说他人向善/, "劝愤怒的人别被仇恨蒙眼"],
      [/凝视着天空中的异常/, "去门外仰望异象天幕"],
      [/主动找到每一个人.*临终关怀/, "逐个做临终关怀式交谈"],
      [/公开宣布自己已代替所有人/, "公开赦免名单"],
      [/发表一番冗长的演说.*暗示自己/, "演说并暗示自己该死"],
      [/递给他一个十字架/, "把十字架递给卡尔"],
      [/引用圣经进行辩护/, "用经文回应所有指控"],
      [/找到派翠克.*如果你的匕首需要血/, "请求派翠克用你的血"],
      [/开始向众人分发.*布条/, "撕布条发给众人当护身符"],
      [/坚定地选择了自己/, "把票投给自己"],
      [/选择.*弃权.*谁没有罪/, "弃权并质问谁没有罪"],
      [/逆着人流冲向正在觉醒的派翠克/, "逆着人流拥向派翠克"],
      [/留下来帮助行动不便.*受伤的人|留下来帮助行动不便的人/, "留下照看伤者"],
      [/主动提议用自己的身体作为.*诱饵/, "提议用自己当诱饵"],
      [/用打火机点燃附近的汽油/, "点燃汽油和怪物同归于尽"],
      [/将密码和所有物品交给他/, "把密码和物品交给子车"],
      [/向每一个遇到的人.*我原谅你/, "向所有相遇者说原谅"],
      [/用身体挡住派翠克/, "用身体挡住派翠克"],
      [/拒绝踏出大门一步/, "转身走向怪物"],
      [/粗暴地检查电子闸门/, "粗查闸门厚度"],
      [/态度恶劣地打断对方/, "对讲机里逼问幕后人"],
      [/走到最不起眼的角落.*背靠墙壁/, "背靠墙站住全场死角"],
      [/翻找能用的工具或撬棍/, "翻金属柜找撬棍"],
      [/暴力撬开上锁的箱子/, "暴力撬箱找武器"],
      [/极其冷淡的语气回怼/, "冷冷顶回命令人"],
      [/暴力拆解刑具上的铁链/, "拆刑具上的铁链"],
      [/设置简单的绊索陷阱/, "在走廊布置绊索"],
      [/无视尸体和文件.*检查焚烧炉/, "检查焚烧炉结构"],
      [/远远地站着听.*谁在结盟/, "远听争吵分析结盟"],
      [/威逼利诱的方式交换.*出口/, "逼换出口情报"],
      [/用铁棍敲打墙壁/, "敲墙找空心位置"],
      [/研究如何让电闸.*永远无法被修复/, "研究怎么废掉电闸"],
      [/不会安慰.*别死在我面前/, "对弱者说别死在你面前"],
      [/复述事实.*隐瞒掉关于.*秘密出口|武器/, "复述事实但藏下出口武器"],
      [/结成.*肌肉同盟/, "和卡尔提议肌肉同盟"],
      [/迅速调查现场.*寻找凶器/, "先查现场找凶器"],
      [/公开宣称.*谁靠近我背后/, "公开警告谁靠近就杀谁"],
      [/不带感情的方式对卡尔进行指控/, "平静列证指向卡尔"],
      [/找到一个制高点.*埋伏/, "占住高点等凶手露头"],
      [/加强自己周边的防御/, "封死一间房门"],
      [/问.*你手上有几个对讲机/, "向山田强要一个对讲机"],
      [/确认他们投票时的.*位置/, "确认投票时每个人站位"],
      [/将部分多余的武器藏在/, "把多余武器藏到出口附近"],
      [/列出几条无法反驳的物理证据/, "列出物理证据压卡尔"],
      [/直接回骂.*只想活着出去/, "回骂道德绑架的人"],
      [/不会为自己的清白做辩解/, "讽刺说若是狼你们早死了"],
      [/展示如何用绳子从高处速降/, "当众示范绳降逃生"],
      [/警告她.*等下别死了/, "警告派翠克别轻信别人"],
      [/制造一小片湿滑区域/, "在正门前做湿滑陷阱"],
      [/她投给了她认定是凶手的卡尔/, "毫不犹豫投卡尔"],
      [/她也考虑过弃权.*最终还是投了/, "犹豫过后仍然站队投票"],
      [/一把抓住狄波拉.*我知道密道/, "抓住狄波拉带她走密道"],
      [/冲向A21.*紧急逃生口/, "按预定路线冲向逃生口"],
      [/主动提出留下断后/, "靠陷阱自愿断后"],
      [/三轮车堵住门口.*扔出雷管/, "堵门后朝怪物扔雷管"],
      [/对讲机都调到最大音量扔出去/, "丢满音量对讲机引怪"],
      [/解开了自己之前设下的某个陷阱/, "解掉自己的陷阱开路"],
      [/将手中的武器砸向派翠克/, "把武器砸向派翠克断后"],
      [/转向A21的紧急逃生出口/, "转去A21紧急出口"],
    ];
    for (const [pattern, value] of tokenMap) {
      if (pattern.test(clean)) return ensureSecondPersonChoice(value);
    }
    return ensureSecondPersonChoice(clean);
  }

  function inferMemoryHooks(clean, tags, targets, location) {
    const hooks = [];
    if (location?.code) hooks.push(`visit:${location.code}`);
    targets.forEach((target) => hooks.push(`target:${target}`));
    if (tags.includes("generator")) hooks.push("system:generator");
    if (tags.includes("vote")) hooks.push("system:vote");
    if (tags.includes("rest")) hooks.push("inner:rest");
    if (/偷听|监听|窃听/.test(clean)) hooks.push("memory:eavesdrop");
    if (/跟踪|尾随/.test(clean)) hooks.push("memory:track");
    return hooks;
  }

  function inferProseHooks(clean, tags, targets, location) {
    const hooks = [];
    if (tags.includes("social")) hooks.push("prose:encounter");
    if (tags.includes("investigate")) hooks.push("prose:scene");
    if (tags.includes("rest")) hooks.push("prose:rest");
    if (tags.includes("attack")) hooks.push("prose:conflict");
    if (targets.includes("patrick")) hooks.push("prose:patrick");
    if (targets.includes("karl")) hooks.push("prose:karl");
    if (targets.includes("meruru")) hooks.push("prose:meruru");
    if (location?.code) hooks.push(`prose:room:${location.code}`);
    if (/投票|处刑/.test(clean)) hooks.push("prose:verdict");
    return hooks;
  }

  function inferNarrativeMotifs(clean, tags, targets, location, slotId) {
    const motifs = [];
    if (/对讲机|广播|通话/.test(clean)) motifs.push("broadcast");
    if (/祈祷|祷告|圣经|告解|赦免|主祷文|安魂/.test(clean)) motifs.push("prayer");
    if (/安慰|祝福|按手|拥抱|关怀|照顾|跟着我|别怕/.test(clean)) motifs.push("care");
    if (/观察|偷听|监听|监控|余光|打分|跟踪|埋伏|位置|视野/.test(clean)) motifs.push("surveillance");
    if (/开锁|喷雾|工具|撬|武器|铁棍|雷管|绳子|钉|匕首|陷阱/.test(clean)) motifs.push("weapon");
    if (/发电机|电闸|电源|密码|开门|闸门/.test(clean)) motifs.push("generator");
    if (/壁画|隐喻|黑山羊|拉丁文|藏书|书籍|抄本|仪式|圣物|灵魂|通灵|占卜/.test(clean)) motifs.push("ritual");
    if (/尸体|死讯|凶器|案发|血|焚烧炉|焚烧房/.test(clean) || slotId === "3.1" || slotId === "3.2" || slotId === "3.3") motifs.push("corpse");
    if (/天空|户外|正门|白门|湖边|异象|雾/.test(clean) || ["D3", "D5", "D6"].includes(location?.code)) motifs.push("sky");
    if (/投票|辩论|处刑|弃权|票/.test(clean)) motifs.push("vote");
    if (/结盟|同盟|交换|套近乎|交易|情报网络|暂时结成/.test(clean)) motifs.push("alliance");
    if (/隐瞒|藏|假装|人设|面具|礼貌|伪装|怯生生/.test(clean)) motifs.push("concealment");
    if (/指控|质问|挑战|警告|威逼|演说|主导叙事|回骂/.test(clean)) motifs.push("pressure");
    if (/救护车|车库|路线|逃跑|逃生口|密道|速降/.test(clean)) motifs.push("escape");
    if (/献祭|受死|断后|同归于尽|噩梦的一部分|挡住|留下/.test(clean)) motifs.push("sacrifice");
    if (tags.includes("rest")) motifs.push("rest");
    return [...new Set(motifs)];
  }

  function analyzeChoice(label, optionKey, slotId, roleId = null) {
    const clean = String(label).replace(/\*\*【休息】\*\*/g, "【休息】").trim();
    const location = findLocation(clean, slotId);
    const targets = findTargets(clean);
    const tags = deriveTags(clean, optionKey);
    const lowerRiskWords = ["安慰", "祝福", "祈祷", "休息", "冥想", "告解", "交谈", "劝告", "安抚"];
    const highRiskWords = ["攻击", "炸", "破坏", "断后", "挡住", "自伤", "献祭", "对视", "逼迫", "指控", "开枪"];
    const risk = highRiskWords.reduce((sum, word) => sum + (clean.includes(word) ? 2 : 0), 0) + (targets.length ? 1 : 0);
    const calm = lowerRiskWords.reduce((sum, word) => sum + (clean.includes(word) ? 1 : 0), 0);
    const intent = {
      clean,
      slotId,
      optionKey,
      tags,
      targets,
      location,
      risk,
      calm,
      voteTarget: inferVoteTarget(clean),
      branchClass: classifyBranch(tags, clean, slotId),
      urgency: inferUrgency(tags, clean, slotId),
    };
    intent.generatorOpportunity = roleId ? getGeneratorOpportunity(roleId, slotId, optionKey) : null;
    intent.plannedGeneratorSlot = !!intent.generatorOpportunity;
    intent.generatorOpportunityKind = intent.generatorOpportunity?.kind || null;
    intent.actionTier = getActionTier(intent);
    intent.mpCost = intent.tags.includes("rest") ? 0 : getOptionMpCost(intent);
    return intent;
  }

  function findTargets(text) {
    return Object.entries(ENTITIES)
      .filter(([id, entity]) => text.includes(entity.short) || text.includes(entity.name))
      .map(([id]) => id);
  }

  function findLocation(text, slotId) {
    const codeMatch = text.match(/([ABCD]\d{1,2})/);
    if (codeMatch) {
      const glossaryMatch = LOCATION_GLOSSARY.find((item) => item.code === codeMatch[1]);
      return glossaryMatch || { code: codeMatch[1], name: SLOT_META[slotId].location, mood: "霉味、金属与过度安静的压迫" };
    }
    const glossaryMatch = LOCATION_GLOSSARY.find((item) => text.includes(item.name));
    if (glossaryMatch) return glossaryMatch;
    const slot = SLOT_META[slotId];
    return { code: slot.locationCode, name: slot.location, mood: "被灯光压白的空气与迟迟不散的消毒水味" };
  }

  function inferVoteTarget(text) {
    if (text.includes("自己")) return "self";
    if (text.includes("卡尔")) return "karl";
    if (text.includes("派翠克")) return "patrick";
    if (text.includes("弃权")) return "abstain";
    return null;
  }

  function getActionTier(intent = {}) {
    if (!intent || intent.tags?.includes("rest")) return "safe";
    if ((intent.tags || []).includes("vote")) return "gamble";
    if (intent.generatorOpportunityKind === "support") return "push";
    if ((intent.tags || []).includes("generator")) return "gamble";
    if ((intent.tags || []).includes("attack")) return "gamble";
    if ((intent.tags || []).includes("protect")) return "push";
    if ((intent.tags || []).includes("social")) return intent.risk >= 2 ? "push" : "safe";
    if ((intent.tags || []).includes("public")) return "push";
    if ((intent.tags || []).includes("investigate")) return intent.risk >= 2 ? "push" : "safe";
    return intent.risk >= 4 ? "gamble" : intent.risk >= 2 ? "push" : "safe";
  }

  function getOptionMpCost(intent = {}) {
    if (intent.tags?.includes("rest")) return 0;
    if (intent.generatorOpportunityKind === "support") return 1;
    if (intent.plannedGeneratorSlot) return 2;
    if ((intent.tags || []).some((tag) => TWO_MP_TAGS.has(tag))) return 2;
    return getActionTier(intent) === "gamble" ? 2 : 1;
  }

  function getRelationBandLabel(value = 0) {
    const relation = clamp(Number(value || 0), RELATION_MIN, RELATION_MAX);
    if (relation >= 20) return "追随";
    if (relation >= 10) return "信任";
    if (relation >= 0) return "观望";
    if (relation >= -10) return "疏离";
    if (relation >= -20) return "敌意";
    return "仇视";
  }

  function isLowSan(currentState = state) {
    return Number(currentState?.stats?.san || 0) < SAN_VISUAL_THRESHOLD;
  }

  function hasPublicRelationImpact(intent = {}) {
    if (!intent) return false;
    if ((intent.tags || []).includes("public") || (intent.tags || []).includes("vote")) return true;
    const clean = String(intent.clean || "");
    return /投票|指控|公开|站队|支持|辩护|揭穿|施压|追问/.test(clean);
  }

  function normalizeRelationDeltaForIntent(delta, intent = {}) {
    const numeric = Number(delta || 0);
    if (!numeric) return 0;
    const tags = intent.tags || [];
    const positive = numeric > 0;
    let minAbs = positive ? 4 : 2;
    let maxAbs = positive ? 8 : 6;
    if (tags.includes("attack")) {
      minAbs = 8;
      maxAbs = 12;
    } else if (tags.includes("protect")) {
      minAbs = positive ? 4 : 2;
      maxAbs = positive ? 10 : 6;
    } else if (tags.includes("vote") || tags.includes("public")) {
      minAbs = positive ? 4 : 8;
      maxAbs = positive ? 10 : 12;
    } else if (tags.includes("social")) {
      minAbs = positive ? 4 : 2;
      maxAbs = positive ? 10 : 6;
    }
    const magnitude = clamp(Math.abs(numeric), minAbs, maxAbs);
    return positive ? magnitude : -magnitude;
  }

  function normalizeEffectRelations(intent = {}, effects = {}) {
    Object.entries(effects.relations || {}).forEach(([key, delta]) => {
      effects.relations[key] = normalizeRelationDeltaForIntent(delta, intent);
    });
  }

  function isVerbalPressureIntent(intent = {}) {
    if (!intent) return false;
    if ((intent.tags || []).includes("attack")) return false;
    if (!((intent.tags || []).includes("public") || (intent.tags || []).includes("vote"))) return false;
    const clean = String(intent.clean || "");
    return /指控|质问|逼问|施压|追问|列出证据|公开点名|辩论/.test(clean);
  }

  function hasImplicitInteractionCue(intent = {}) {
    if (!intent) return false;
    const clean = String(intent.clean || "");
    if (!clean) return false;
    return /试探|安慰|安抚|告诉|警告|劝告|询问|交换|递给|交给|分享|帮助|帮忙|别死|跟着我|闭嘴|回骂|死死抓住|抓住|握住|原谅|游说|介入|拉住|站队|支持/.test(clean);
  }

  function isProtectiveAttackIntent(intent = {}) {
    if (!intent) return false;
    const tags = intent.tags || [];
    if (!tags.includes("attack")) return false;
    const clean = String(intent.clean || "");
    return /断后|挡住|掩护|保护|守住|守门|争取开门|去开门|先走|让你先走|我留在这里|回身断后|拖住/.test(clean);
  }

  function usesCrowdFacingTone(intent = {}, slotId = "") {
    if (!intent) return false;
    if ((intent.tags || []).includes("public") || (intent.tags || []).includes("vote")) return true;
    const clean = String(intent.clean || "");
    if (/所有人|众人|大家|每一个人|公开|发表|宣布|分享/.test(clean)) return true;
    return String(slotId || "").startsWith("4.");
  }

  function buildLowSanEcho(currentState = state, mode = "header", slotId = currentSlotId()) {
    if (!isLowSan(currentState)) return "";
    const sanState = getSanState(currentState);
    if (sanState === "truth") {
      return mode === "result"
        ? "你已经分不清是自己在整理线索，还是墙里的东西在替你排序。"
        : "你能感觉到视线不只来自活人，连房间本身都像在等你说错下一句话。";
    }
    if (mode === "result") return "回声比十五分钟前更近了一点，像有人贴在墙后替你记住了刚才的选择。";
    if (slotId === VOTE_REVEAL_SLOT) return "票纸翻开之后，连沉默都像在你耳边发出细小的摩擦声。";
    const slot = SLOT_META[slotId];
    if (slot?.locationCode === "A13") return "石室里的空气像被谁多按住了一秒，呼吸和心跳都开始互相挤压。";
    return "你总觉得有另一道更慢的呼吸贴着你的动作，在后面一格一格地跟。";
  }

  function isVoteRevealSlot(slotId) {
    return slotId === VOTE_REVEAL_SLOT;
  }

  function isEntityAlive(currentState, entityId) {
    if (!entityId) return false;
    const dead = new Set(currentState?.deadEntities || []);
    return !dead.has(entityId);
  }

  function getLivingVoteTargets(currentState, voterId) {
    return Object.keys(ENTITIES).filter((id) => id !== voterId && isEntityAlive(currentState, id));
  }

  function resolveNeutralVoteTarget(voterId, draftState, preferredTarget = null) {
    const candidates = getLivingVoteTargets(draftState, voterId);
    if (!candidates.length) return "player";
    const preference = preferredTarget && preferredTarget !== "abstain" ? preferredTarget : null;
    const voterRelation = clamp(Number(draftState.relations?.[voterId] || 0), RELATION_MIN, RELATION_MAX);
    let bestTarget = candidates[0];
    let bestScore = -Infinity;
    const priorities = ["player", "karl", "patrick", "emily", "fan", "ziche", "yamada", "debora", "anjie", "meruru"];
    candidates.forEach((target) => {
      let score = 0;
      score += Math.max(0, (draftState?.suspicion?.[voterId]?.[target] || 0) / 8);
      if (target === draftState.selectedRole) score += 1;
      if (target === "karl") score += (draftState.flags.karlExposed || 0) * 2 + Math.max(0, (draftState.suspicion?.player?.karl || 0) / 12);
      if (target === "patrick") score += (draftState.flags.patrickAwakened ? 2 : 0) + Math.max(0, (draftState.suspicion?.player?.patrick || 0) / 12);
      if (target === "emily") score += draftState.flags.emilyProtected ? 1 : 0;
      if (target === preference) score += 6;
      if (target === "player") score += Math.max(0, (draftState.suspicion?.[voterId]?.player || 0) / 5);
      if (target === preference) score += Math.max(0, voterRelation / 4);
      if (target === draftState.selectedRole) score += Math.max(0, -voterRelation / 4);
      if (target === "meruru" && draftState.flags.meruruDead) score -= 999;
      if (score > bestScore || (score === bestScore && priorities.indexOf(target) < priorities.indexOf(bestTarget))) {
        bestTarget = target;
        bestScore = score;
      }
    });
    return bestTarget;
  }

  function getRelationPlayerVoteMultiplier(relation) {
    const value = clamp(Number(relation || 0), RELATION_MIN, RELATION_MAX);
    if (value >= -15 && value <= -6) return 1.5;
    if (value >= -5 && value <= -1) return 1.25;
    if (value >= 1 && value <= 5) return 0.75;
    if (value >= 6 && value <= 15) return 0.5;
    return 1;
  }

  function hasKarlExposedBeforeVote(draftState) {
    return Number(draftState?.flags?.karlExposed || 0) > 0;
  }

  function chooseWeightedRandomVoteTarget(voterId, draftState) {
    const playerId = draftState.selectedRole;
    const relation = clamp(Number(draftState.relations?.[voterId] || 0), RELATION_MIN, RELATION_MAX);
    const candidates = getLivingVoteTargets(draftState, voterId)
      .filter((id, index, array) => id && id !== "abstain" && array.indexOf(id) === index);
    if (!candidates.length) return playerId || "player";
    const weighted = candidates.map((id) => ({
      id,
      weight: Math.max(0.1, id === playerId ? getRelationPlayerVoteMultiplier(relation) : 1),
    }));
    const total = weighted.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;
    for (const item of weighted) {
      roll -= item.weight;
      if (roll <= 0) return item.id;
    }
    return weighted[weighted.length - 1]?.id || candidates[0];
  }

  function resolveWeightedVoteTarget(voterId, draftState, playerChoice = null) {
    const playerId = draftState.selectedRole;
    const relation = clamp(Number(draftState.relations?.[voterId] || 0), RELATION_MIN, RELATION_MAX);
    const baseTarget = resolveNeutralVoteTarget(voterId, draftState, playerChoice);
    if (!playerId || relation <= -16 || relation >= 16 || baseTarget === playerId) return baseTarget;
    const candidates = [baseTarget, playerId].filter((id, index, array) => id && id !== "abstain" && array.indexOf(id) === index);
    const weights = Object.fromEntries(candidates.map((id) => [id, id === playerId ? getRelationPlayerVoteMultiplier(relation) : 1]));
    const bestScore = Math.max(...Object.values(weights));
    const winners = candidates.filter((id) => weights[id] === bestScore);
    return winners.includes(baseTarget) ? baseTarget : winners[0] || baseTarget;
  }

  function resolveVoteLedger(draftState, playerVote = "crowd") {
    const playerId = draftState.selectedRole;
    const normalizedPlayerVote = !playerVote || playerVote === "crowd"
      ? resolveNeutralVoteTarget("player", draftState, null)
      : playerVote === "self"
        ? playerId
        : playerVote;
    const playerChoice = normalizedPlayerVote;
    const ledger = {};
    const tally = {};
    const addVote = (voterId, targetId) => {
      ledger[voterId] = targetId;
      if (!targetId || targetId === "abstain") return;
      tally[targetId] = (tally[targetId] || 0) + 1;
    };
    addVote("player", playerChoice);
    const karlExposed = hasKarlExposedBeforeVote(draftState);
    Object.keys(ENTITIES).forEach((voterId) => {
      if (voterId === playerId || !isEntityAlive(draftState, voterId)) return;
      const relation = clamp(Number(draftState.relations?.[voterId] || 0), RELATION_MIN, RELATION_MAX);
      let targetId = null;
      if (relation <= -16) {
        targetId = playerId;
      } else if (relation >= 16) {
        targetId = playerChoice;
      } else if (!karlExposed && relation >= -15 && relation <= 15) {
        targetId = chooseWeightedRandomVoteTarget(voterId, draftState);
      } else {
        targetId = resolveWeightedVoteTarget(voterId, draftState, playerChoice);
      }
      addVote(voterId, targetId);
    });
    if (!Object.keys(tally).length) {
      const fallback = resolveNeutralVoteTarget("player", draftState, playerChoice);
      tally[fallback] = 1;
    }
    const topScore = Math.max(...Object.values(tally));
    const deaths = Object.entries(tally)
      .filter(([, count]) => count === topScore)
      .map(([id]) => id);
    const exiledByVote = deaths.includes(playerId);
    return { ledger, tally, deaths, exiledByVote, playerChoice };
  }

  function getOccupantsAtPosition(draftState, position, exclude = []) {
    if (!position) return [];
    const excluded = new Set(exclude);
    return Object.entries(draftState.npcPositions || {})
      .filter(([id, pos]) => pos === position && !excluded.has(id) && isEntityAlive(draftState, id))
      .map(([id]) => id);
  }

  function getWitnessesForIntent(draftState, intent = {}, exclude = [], fallbackPosition = null) {
    const excluded = new Set(exclude.filter(Boolean));
    const alive = Object.keys(ENTITIES).filter((id) => !excluded.has(id) && isEntityAlive(draftState, id));
    if (!alive.length) return [];
    const rawPosition = fallbackPosition || intent.location?.code || "";
    if (!rawPosition) return usesCrowdFacingTone(intent, intent.slotId) ? alive : [];
    const positions = rawPosition
      .split(/\s*\/\s*|\s*-\s*(?=[A-Z])/)
      .map((item) => item.trim())
      .filter(Boolean);
    if (!positions.length) return usesCrowdFacingTone(intent, intent.slotId) ? alive : [];
    const positionSet = new Set(positions);
    const crowd = Object.entries(draftState.npcPositions || {})
      .filter(([id, pos]) => !excluded.has(id) && isEntityAlive(draftState, id) && positionSet.has(pos))
      .map(([id]) => id);
    if (crowd.length) return crowd;
    return usesCrowdFacingTone(intent, intent.slotId) ? alive : [];
  }

  function rankEncounterCandidates(roleId, slotId, intent, draftState, candidates) {
    return [...candidates].sort((a, b) => scoreEncounterCandidate(roleId, slotId, intent, draftState, b) - scoreEncounterCandidate(roleId, slotId, intent, draftState, a));
  }

  function scoreEncounterCandidate(roleId, slotId, intent, draftState, candidateId) {
    let score = 0;
    if (!candidateId) return score;
    if (intent.targets.includes(candidateId)) score += 40;
    if (intent.tags.includes("protect") && candidateId === "emily") score += 24;
    if (intent.tags.includes("generator") && candidateId === "karl") score += 12;
    if (intent.tags.includes("social")) score += 6;
    if (intent.tags.includes("attack") && candidateId === "karl") score += 10;
    if (slotId === STORY_ANCHORS.secondGather && candidateId === "meruru") score += 16;
    if (slotId === STORY_ANCHORS.meruruDeath && candidateId === "karl") score += 20;
    if (slotId === STORY_ANCHORS.patrickAwakening && candidateId === "patrick") score += 30;
    if (slotId.startsWith("4.") && intent.voteTarget === candidateId) score += 24;
    score += Math.max(0, (draftState.relations[candidateId] || 0) / 4);
    score += Math.max(0, (draftState.suspicion?.player?.[candidateId] || 0) / 8);
    return score;
  }

  function chooseEncounter(roleId, slotId, intent, draftState) {
    const firstAlive = (...ids) => ids.find((id) => id && isEntityAlive(draftState, id)) || null;
    const explicit = intent.targets.filter((target) => target !== roleId);
    if (explicit.length) return firstAlive(...explicit) || explicit[0];
    const localOccupants = rankEncounterCandidates(roleId, slotId, intent, draftState, getOccupantsAtPosition(draftState, intent.location?.code, [roleId]));
    if (localOccupants.length) return localOccupants[0];
    if (slotId === "1.1") return firstAlive("meruru");
    if (slotId === STORY_ANCHORS.firstGather) return firstAlive(roleId === "anjie" ? "patrick" : roleId === "yamada" ? "emily" : "karl", "emily", "patrick", "ziche");
    if (slotId === "2.2") return firstAlive("meruru", "emily");
    if (slotId === STORY_ANCHORS.secondGather) return firstAlive(roleId === "patrick" ? "anjie" : roleId === "yamada" ? "emily" : "karl", "anjie", "emily", "patrick");
    if (slotId === STORY_ANCHORS.meruruDeath) return firstAlive("karl", "emily");
    if (slotId === "3.4") return firstAlive(roleId === "anjie" ? "patrick" : roleId === "patrick" ? "anjie" : "emily", "emily", "anjie", "patrick");
    if (slotId.startsWith("4.")) {
      if (intent.voteTarget === "karl") return firstAlive("karl", "emily", "patrick");
      if (intent.voteTarget === "patrick") return firstAlive("patrick", "emily", "anjie");
      return firstAlive(roleId === "yamada" ? "emily" : "karl", "emily", "patrick", "anjie");
    }
    if (slotId === STORY_ANCHORS.patrickAwakening) return firstAlive("patrick", "emily", "anjie");
    if (slotId === "5.2") return firstAlive(draftState.relations.emily > 8 ? "emily" : draftState.relations.patrick > 8 ? "patrick" : "karl", "emily", "anjie", "ziche");
    if (slotId === "5.3") return firstAlive(roleId === "yamada" ? "emily" : roleId === "anjie" ? "patrick" : "karl", "emily", "anjie", "ziche");
    if (slotId === "5.4") return firstAlive("patrick", "emily", "anjie", "ziche");
    if (intent.tags.includes("protect")) return firstAlive("emily", "anjie", "patrick");
    if (intent.tags.includes("social")) return firstAlive("karl", "emily", "patrick", "anjie");
    return localOccupants[0] || firstAlive("meruru", "emily", "patrick", "anjie");
  }

  function buildEffects(roleId, slotId, intent, draftState, encounterId) {
    const isRest = intent.tags.includes("rest");
    const generatorOpportunity = getGeneratorOpportunity(roleId, slotId, intent.optionKey);
    const slotGeneratorOpportunities = getGeneratorOpportunitiesForSlot(roleId, slotId);
    const plannedGeneratorSlot = !!generatorOpportunity;
    const slotHasGeneratorOpportunity = slotGeneratorOpportunities.length > 0;
    const generatorKind = generatorOpportunity?.kind || null;
    const directGeneratorAction = intent.tags.includes("generator");
    const supportGeneratorPush = generatorKind === "support";
    const indirectGeneratorPush = plannedGeneratorSlot && (!directGeneratorAction || supportGeneratorPush);
    const actionCost = intent.mpCost || getOptionMpCost(intent);
    const effects = {
      stats: { hp: 0, mp: 0, san: 0, truth: 0 },
      generatorGain: 0,
      generatorKind: null,
      addWords: [],
      addClues: [],
      addItems: [],
      relations: {},
      relationEchoes: {},
      suspicion: [],
      flags: {},
      keyChoices: {},
      alliances: {},
      positions: {},
      notes: [],
    };
    const generousPattern = /安抚|共同行动|交换情报|保护|照顾|协助|结盟|坦诚|递给|告诉|并肩|守住|帮助|守护|支持|辩护|陪同|合作|让你先走|替.*担|替.*挡|掩护|让利|分担|扛下/;
    const coldPattern = /试探|利用|冷处理|回避|敷衍|隐瞒|撒谎|拒绝|推开|保持距离|套话|观察反应|先记下弱点|先不表态/;
    const harshPattern = /逼问|威胁|拆穿|公开压|处决|施压|质问|逼迫|羞辱|斥责|强迫|命令|出卖|压人|当众追打/;

    if (isRest) {
      effects.stats.mp += draftState.maxStats.mp - draftState.stats.mp;
      effects.flags.restUsedSlot = slotId;
      effects.stats.hp += isHeavyInjury(draftState) ? 2 : 1;
      effects.stats.san += 3;
      effects.notes.push("你把这十五分钟留给自己，也因此错过了别处更早开始的异动。");
    }

    if (!isRest && intent.tags.includes("investigate")) {
      effects.stats.truth += intent.actionTier === "gamble" ? 2 : 1;
      effects.notes.push("你把这一步换成了更扎实的线索推进。");
    }

    if (!isRest && intent.tags.includes("occult")) {
      effects.stats.truth += 2;
      effects.stats.san -= intent.actionTier === "gamble" ? 7 : 4;
      effects.notes.push("你离真相更近了一层，也让理智先替你付了代价。");
    }

    if (!isRest && intent.tags.includes("social")) {
      const target = encounterId;
      const generous = generousPattern.test(intent.clean) || intent.tags.includes("protect");
      const cold = coldPattern.test(intent.clean);
      const harsh = harshPattern.test(intent.clean);
      if (target) {
        let delta = 0;
        if (harsh) delta = intent.actionTier === "gamble" ? -12 : -10;
        else if (cold) delta = intent.actionTier === "gamble" ? -6 : -4;
        else if (generous) delta = intent.actionTier === "gamble" ? 12 : 8;
        else delta = intent.actionTier === "safe" ? 5 : 8;
        effects.relations[target] = (effects.relations[target] || 0) + delta + Math.min(intent.calm, 2);
        effects.suspicion.push({
          observer: target,
          subject: "player",
          delta: harsh ? 16 : cold ? 8 : intent.tags.includes("public") ? 12 : 5,
        });
        effects.notes.push(
          harsh
            ? `你把${ENTITIES[target].short}逼得太紧，这会直接恶化之后的票向。`
            : cold
              ? `你没有把善意留给${ENTITIES[target].short}，这份疏离会被记住。`
              : generous
                ? `你替${ENTITIES[target].short}分担了风险，信任因此被明显抬高。`
                : `你和${ENTITIES[target].short}之间的关系被推了一下。`,
        );
      }
    }

    if (!isRest && intent.tags.includes("attack")) {
      const target = encounterId;
      const protectiveAttack = isProtectiveAttackIntent(intent);
      effects.stats.hp -= intent.tags.includes("selfHarm")
        ? 8
        : protectiveAttack && intent.actionTier === "gamble"
          ? 8
          : intent.actionTier === "gamble"
            ? 6
            : 5;
      effects.stats.san -= intent.actionTier === "gamble" ? 10 : 8;
      if (target) {
        if (protectiveAttack) {
          effects.relations[target] = (effects.relations[target] || 0) + (intent.actionTier === "gamble" ? 8 : 6);
        } else {
          effects.relations[target] = (effects.relations[target] || 0) - (intent.actionTier === "gamble" ? 12 : 10);
        }
      }
      if (target === "karl") effects.flags.karlExposed = (draftState.flags.karlExposed || 0) + 1;
      if (target) {
        effects.suspicion.push({ observer: target, subject: "player", delta: protectiveAttack ? 8 : 18 });
      }
      effects.notes.push(
        protectiveAttack
          ? "你把自己留在更危险的位置替别人断后，伤势会先落到你身上。"
          : "你把局面推向了正面对抗，伤势和敌意都会因此抬高。",
      );
    }

    if (!isRest && intent.tags.includes("protect")) {
      if (encounterId) effects.relations[encounterId] = (effects.relations[encounterId] || 0) + (intent.actionTier === "gamble" ? 12 : 9);
      if (slotId.startsWith("4.") || slotId.startsWith("5.")) effects.stats.truth += 1;
      effects.stats.hp -= intent.actionTier === "gamble" ? 4 : 2;
      if (encounterId === "emily") effects.flags.emilyProtected = true;
      if (encounterId === "patrick") effects.flags.patrickBond = true;
      if (encounterId) effects.alliances[encounterId] = draftState.relations[encounterId] >= 16 ? "deep_trust" : "allied";
      effects.notes.push("你替别人挡下了一部分风险，关系也因此更快靠近。");
    }

    if (!isRest && intent.tags.includes("public") && !intent.tags.includes("social")) {
      effects.stats.truth += 1;
      effects.stats.san -= intent.actionTier === "gamble" ? 6 : 4;
      if (isVerbalPressureIntent(intent) && intent.actionTier === "gamble") effects.stats.san += 2;
      if (encounterId && /指控|逼问|拆穿|施压|公开|怀疑|处决/.test(intent.clean)) {
        effects.relations[encounterId] = (effects.relations[encounterId] || 0) - (intent.actionTier === "gamble" ? 12 : 8);
        effects.notes.push("你把立场摆得太硬，这会直接恶化之后的票向。");
      } else if (encounterId && /辩护|支持|保护|跟随|赞同/.test(intent.clean)) {
        effects.relations[encounterId] = (effects.relations[encounterId] || 0) + (intent.actionTier === "gamble" ? 12 : 8);
        effects.notes.push("你公开站在了对方一侧，这会抬高之后的跟票概率。");
      }
      if (intent.clean.includes("投票") || intent.tags.includes("vote")) {
        const target = ENTITIES[intent.voteTarget] ? intent.voteTarget : encounterId;
        if (target) effects.relations[target] = (effects.relations[target] || 0) - (intent.actionTier === "gamble" ? 10 : 6);
        effects.notes.push("你把名字写上票纸，票型已经开始按这个方向收束。");
      }
    }

    if (!isRest && (directGeneratorAction || plannedGeneratorSlot) && draftState.generators.progress < 4) {
      effects.generatorGain = 1;
      effects.generatorKind = generatorKind || (directGeneratorAction ? "direct" : null);
      effects.stats.truth += plannedGeneratorSlot ? (indirectGeneratorPush ? 1 : 2) : 1;
      if (supportGeneratorPush) {
        effects.stats.san -= 3;
      } else if (indirectGeneratorPush) {
        effects.stats.san -= intent.mpCost >= 2 ? (intent.actionTier === "safe" ? 3 : 4) : 3;
      } else {
        effects.stats.san -= plannedGeneratorSlot ? (intent.mpCost >= 2 ? 7 : 5) : 3;
      }
      if (supportGeneratorPush) {
        effects.notes.push("你用协助而不是硬修把供电条件往前推了一格。");
      }
      if (plannedGeneratorSlot && intent.mpCost >= 2 && !indirectGeneratorPush) effects.stats.hp -= 5;
      else if (intent.actionTier === "gamble") effects.stats.hp -= 2;
      effects.addWords.push(PASSWORD_WORDS[draftState.generators.progress]);
      if (indirectGeneratorPush) {
        effects.notes.push(intent.mpCost >= 2
          ? (generatorKind === "fallback" ? "你把高投入行动换成了一次补救推进，勉强把开门条件往前顶了一格。" : generatorKind === "support" ? "你把这次协助接进供电线路，开门条件因此前进了一格。" : "你把高投入行动换成了一次关键推进，开门条件因此前进了一格。")
          : (generatorKind === "fallback" ? "你抓住了少数补救机会，让供电条件没有彻底断掉。" : generatorKind === "support" ? "你借这次协助稳住了供电条件。" : "你把局势轻轻推向了供电条件成立的一侧。"));
      } else {
        effects.notes.push(plannedGeneratorSlot
          ? (generatorKind === "fallback"
            ? (intent.mpCost >= 2 ? "你强行抢下了一台补救发电机。" : "你推进了一台补救发电机。")
            : (intent.mpCost >= 2 ? "你强行推进了一台关键发电机。" : "你推进了一台关键发电机。"))
          : "你推进了发电机，但只摸到了部分线索。");
      }
    } else if (!isRest && plannedGeneratorSlot && draftState.generators.progress >= 4) {
      effects.notes.push("你摸到了发电机位置，但白门条件已经被别的步骤决定。");
    }
    if (!isRest && slotHasGeneratorOpportunity && !plannedGeneratorSlot && !intent.tags.includes("generator") && draftState.generators.progress < 4) {
      effects.notes.push("你错过了本时段最直接的供电推进。");
      effects.stats.san -= draftState.generators.progress >= 2 ? 3 : 2;
    }
    if (plannedGeneratorSlot && draftState.generators.progress >= 3) {
      effects.notes.push("这一步离白门只剩最后一口气，任何犹豫都会被记成错过。");
    }
    if (!isRest && slotId.startsWith("5.") && draftState.generators.progress + effects.generatorGain < 4) {
      effects.notes.push("白门条件仍不足。");
    }

    if (!isRest && encounterId === "meruru" && (intent.tags.includes("social") || intent.tags.includes("protect"))) {
      effects.flags.meruruBlessing = true;
    }
    if (!isRest && encounterId === "patrick" && (intent.tags.includes("social") || intent.tags.includes("protect"))) {
      effects.flags.patrickBond = true;
      effects.relations.patrick = (effects.relations.patrick || 0) + 6;
    }
    if (!isRest && encounterId === "karl" && /指控|警告|质问|挑战/.test(intent.clean)) {
      effects.flags.karlExposed = (draftState.flags.karlExposed || 0) + 1;
      effects.relations.karl = (effects.relations.karl || 0) - 8;
    }
    if (!isRest && encounterId === "emily" && /安慰|保护|照顾|守护/.test(intent.clean)) {
      effects.flags.emilyProtected = true;
      effects.relations.emily = (effects.relations.emily || 0) + 10;
    }

    const clueCandidates = [
      { pattern: /戒指/, clue: "狼群戒指" },
      { pattern: /日记/, clue: "露西日记残页" },
      { pattern: /眼球/, clue: "血丝眼球" },
      { pattern: /手链|红绳/, clue: "红绳手链" },
      { pattern: /病历|医疗报告/, clue: "布莱克病历" },
      { pattern: /遗言/, clue: "艾德莉遗言" },
      { pattern: /匕首/, clue: "活化匕首" },
      { pattern: /焚烧房|焚化炉/, clue: "焚烧房焦痕" },
      { pattern: /藏书馆|书籍|抄本/, clue: "母神抄本摘记" },
      { pattern: /实验室|白骨/, clue: "实验室白骨记录" },
      { pattern: /监控/, clue: "残损监控记录" },
      { pattern: /院长办公室/, clue: "布莱克伍德文稿" },
    ];

    clueCandidates.forEach((item) => {
      if (!isRest && item.pattern.test(intent.clean)) effects.addClues.push(item.clue);
    });

    if (!isRest && /对讲机/.test(intent.clean)) effects.addItems.push("对讲机");
    if (!isRest && /眼球/.test(intent.clean)) effects.addItems.push("眼球");
    if (!isRest && /戒指/.test(intent.clean)) effects.addItems.push("狼群戒指");
    if (!isRest && /匕首/.test(intent.clean)) effects.addItems.push("活化匕首");

    if (slotId === "2.4" && isRest) {
      effects.stats.truth += 1;
      effects.notes.push("这次集体分享让所有人的说辞第一次被摆在同一盏灯下。");
    }
    if (slotId === STORY_ANCHORS.meruruDeath) {
      effects.flags.meruruDead = true;
      effects.addClues.push("梅露露之死");
      effects.positions.meruru = "B2";
      effects.positions.karl = "B2";
      effects.suspicion.push({ observer: "player", subject: "karl", delta: 18 });
      if (draftState.flags.meruruBlessing) effects.addClues.push("梅露露临终碎语");
    }
    if (slotId === "3.2" || slotId === STORY_ANCHORS.meruruDeath) {
      effects.stats.truth += 1;
      effects.addClues.push("户外紫灰天空");
    }
    if (slotId === "4.4") {
      effects.flags.voteTarget = intent.voteTarget || "crowd";
      effects.flags.voteRevealPending = true;
      effects.keyChoices.vote_target = intent.voteTarget || "crowd";
      effects.notes.push("你已经把立场写上票纸，票向从这一刻开始被正式锁定。");
    }
    if (slotId === "5.1") {
      effects.flags.patrickAwakened = true;
      effects.stats.san -= roleId === "patrick" ? 4 : 3;
      if (draftState.relations.patrick >= 16 || draftState.flags.patrickBond) {
        effects.flags.patrickMercy = true;
      }
    }
    if (slotId === "5.4") {
      effects.keyChoices.final_choice = /断后|留下|成为噩梦|挡住/.test(intent.clean) ? "sacrifice" : "escape";
    }

    if (!isRest && roleId === "fan" && /祈祷|赦免|告解/.test(intent.clean)) {
      effects.stats.truth += 1;
      effects.stats.san -= 2;
    }
    if (!isRest && roleId === "ziche" && /武器|铁棍|陷阱|雷管|堵住/.test(intent.clean)) {
      effects.stats.truth += 1;
    }
    if (!isRest && roleId === "yamada" && /艾米莉|姐姐|安抚/.test(intent.clean)) {
      effects.flags.emilyProtected = true;
      effects.relations.emily = (effects.relations.emily || 0) + 8;
    }
    if (!isRest && roleId === "anjie" && /记录|推理|思维导图|结盟|情报/.test(intent.clean)) {
      effects.stats.truth += 1;
    }
    if (!isRest && roleId === "debora" && /爆破|燃烧瓶|消防|专业/.test(intent.clean)) {
      effects.stats.truth += 1;
      effects.addClues.push("爆破装置判断");
    }
    if (!isRest && roleId === "patrick" && /通灵|占卜|匕首|灵魂/.test(intent.clean)) {
      effects.stats.truth += 1;
      effects.stats.san -= 2;
    }

    normalizeEffectRelations(intent, effects);

    if (!isRest) {
      effects.stats.mp -= actionCost;
      if (indirectGeneratorPush) {
        effects.stats.san -= intent.actionTier === "gamble" ? 4 : intent.actionTier === "push" ? 2 : 0;
      } else if (intent.actionTier === "gamble" && !intent.tags.includes("attack") && !intent.tags.includes("generator")) {
        effects.stats.san -= 8;
      } else if (intent.actionTier === "push") {
        effects.stats.san -= 5;
      } else if (intent.actionTier === "safe" && !intent.tags.includes("rest")) {
        effects.stats.san -= 2;
      }
    }

    effects.stats.truth = scaleTruthGain(effects.stats.truth);
    const truthBefore = clamp(Number(draftState.stats.truth || 0), 0, 100);
    const truthAfter = clamp(truthBefore + effects.stats.truth, 0, 100);
    const tierDelta = getTruthTier(truthAfter) - getTruthTier(truthBefore);
    if (tierDelta > 0) {
      effects.stats.san -= tierDelta * 5;
    }

    effects.positions.player = intent.location?.code || draftState.playerPosition;
    if (encounterId && effects.positions.player) effects.positions[encounterId] = effects.positions.player;

    if (!isRest && hasPublicRelationImpact(intent)) {
      const primaryTargetId = encounterId
        || intent.targets?.find((id) => ENTITIES[id] && id !== roleId)
        || Object.entries(effects.relations || {})
          .sort((a, b) => Math.abs(Number(b[1] || 0)) - Math.abs(Number(a[1] || 0)))[0]?.[0]
        || null;
      const occupants = getWitnessesForIntent(draftState, intent, [roleId, primaryTargetId], effects.positions.player);
      const primaryDelta = primaryTargetId ? Number(effects.relations?.[primaryTargetId] || 0) : 0;
      const echo = primaryDelta > 0
        ? clamp(Math.ceil(primaryDelta / 2), -6, 6)
        : primaryDelta < 0
          ? clamp(Math.floor(primaryDelta / 2), -6, 6)
          : 0;
      if (echo && occupants.length) {
        occupants.forEach((id) => {
          const currentDelta = effects.relationEchoes[id] || 0;
          effects.relationEchoes[id] = clamp(currentDelta + echo, -6, 6);
        });
        effects.notes.push(echo > 0 ? "你的公开站队也被旁观者记住了。" : "你的公开施压连旁观者的票向都一起拉冷了。");
      }
    }

    applyInteractionRelationFallback(draftState, intent, encounterId, effects);
    applyAmbientRelationRipples(draftState, intent, encounterId, effects);

    effects.stats.san = rebalanceSanDelta(effects.stats.san, intent);
    return effects;
  }

  function rebalanceSanDelta(delta, intent = {}) {
    const value = Number(delta || 0);
    if (value >= 0) return value;
    return Math.min(-1, Math.ceil(value * 0.8));
  }

  function applyEffectsToState(draftState, effects, scene) {
    draftState.stats.hp = clamp(draftState.stats.hp + effects.stats.hp, 0, draftState.maxStats.hp);
    draftState.stats.mp = clamp(draftState.stats.mp + effects.stats.mp, 0, draftState.maxStats.mp);
    draftState.stats.san = clamp(draftState.stats.san + effects.stats.san, 0, MAX_SAN);
    const truthBefore = clamp(Number(draftState.stats.truth || 0), 0, 100);
    draftState.stats.truth = clamp(truthBefore + effects.stats.truth, 0, 100);

    if (effects.generatorGain > 0) {
      draftState.generators.progress = clamp(draftState.generators.progress + effects.generatorGain, 0, 4);
      effects.addWords.forEach((word) => {
        if (!draftState.generators.words.includes(word)) draftState.generators.words.push(word);
      });
    }

    effects.addClues.forEach((clue) => {
      if (!draftState.clues.includes(clue)) draftState.clues.push(clue);
    });

    effects.addItems.forEach((item) => {
      if (!draftState.items.includes(item)) draftState.items.push(item);
    });

    Object.entries(effects.relations).forEach(([key, delta]) => {
      draftState.relations[key] = clamp((draftState.relations[key] || 0) + delta, RELATION_MIN, RELATION_MAX);
    });

    Object.entries(effects.relationEchoes || {}).forEach(([key, delta]) => {
      draftState.relations[key] = clamp((draftState.relations[key] || 0) + delta, RELATION_MIN, RELATION_MAX);
    });

    effects.suspicion.forEach(({ observer, subject, delta }) => {
      draftState.suspicion[observer][subject] = clamp((draftState.suspicion?.[observer]?.[subject] || 0) + delta, 0, 100);
    });

    Object.entries(effects.flags).forEach(([key, value]) => {
      if (typeof value === "number") {
        draftState.flags[key] = value;
      } else if (value === true) {
        draftState.flags[key] = true;
      } else if (value) {
        draftState.flags[key] = value;
      }
    });
    if (effects.flags.restUsedSlot) {
      draftState.flags.restUsedSlot = effects.flags.restUsedSlot;
    }

    Object.assign(draftState.keyChoices, effects.keyChoices);
    Object.assign(draftState.alliances, effects.alliances);
    Object.entries(effects.positions).forEach(([key, position]) => {
      if (key === "player") {
        draftState.playerPosition = position;
      } else {
        draftState.npcPositions[key] = position;
      }
    });

    const visitKey = scene.location.code || scene.location.name;
    draftState.visits[visitKey] = (draftState.visits[visitKey] || 0) + 1;
    draftState.flags.truthSeen = Math.max(draftState.flags.truthSeen || 0, draftState.stats.truth);
    draftState.npcPositions = advanceNpcPositions(draftState, scene.slotId, visitKey);
  }

  function addRelationRipple(effects, id, delta, direct = false) {
    if (!id || !ENTITIES[id] || !delta) return;
    const bucket = direct ? effects.relations : effects.relationEchoes;
    bucket[id] = clamp((bucket[id] || 0) + delta, -6, 6);
  }

  function getAmbientRelationDelta(intent = {}, effects = {}) {
    const tags = intent.tags || [];
    if (tags.includes("attack") || tags.includes("vote")) return 0;
    if (tags.includes("protect") || tags.includes("social") || tags.includes("public")) return 0;
    if (tags.includes("rest")) return -1;
    if (effects.generatorGain > 0) return 1;
    if (tags.includes("investigate") || Number(effects.stats?.truth || 0) > 0) return 1;
    if (intent.actionTier === "gamble") return -1;
    if (intent.actionTier === "safe" && Number(intent.calm || 0) > 0) return 1;
    return 0;
  }

  function applyAmbientRelationRipples(draftState, intent, encounterId, effects = {}) {
    if (!draftState || !intent || !effects) return;
    const roleId = draftState.selectedRole;
    const changed = new Set([
      ...Object.keys(effects.relations || {}),
      ...Object.keys(effects.relationEchoes || {}),
    ]);
    const baseDelta = getAmbientRelationDelta(intent, effects);
    if (!baseDelta) return;
    const localTargets = new Set([
      encounterId,
      ...(intent.targets || []),
      ...getWitnessesForIntent(draftState, intent, [roleId], effects.positions?.player || intent.location?.code),
    ].filter((id) => id && id !== roleId && ENTITIES[id] && isEntityAlive(draftState, id)));
    localTargets.forEach((id) => {
      if (changed.has(id)) return;
      const localDelta = clamp(baseDelta * (intent.actionTier === "gamble" ? 3 : 2), -4, 4);
      addRelationRipple(effects, id, localDelta, id === encounterId || intent.targets?.includes(id));
      changed.add(id);
    });
    const globalDelta = clamp(baseDelta, -1, 1);
    if (!globalDelta) return;
    Object.keys(ENTITIES).forEach((id) => {
      if (id === roleId || changed.has(id) || !isEntityAlive(draftState, id)) return;
      addRelationRipple(effects, id, globalDelta, false);
    });
  }

function applyInteractionRelationFallback(draftState, intent, encounterId, effects = {}) {
    if (!draftState || !intent) return;
    const changed = Object.keys(effects.relations || {}).length > 0 || Object.keys(effects.relationEchoes || {}).length > 0;
    if (changed) return;
    const targetId = encounterId || intent.targets?.[0] || null;
    if (!targetId || !ENTITIES[targetId] || targetId === draftState.selectedRole) return;
    const explicitTarget = Array.isArray(intent.targets) && intent.targets.includes(targetId);
    const implicitInteraction = hasImplicitInteractionCue(intent);
    if (!["social", "protect", "public", "attack", "vote"].some((tag) => intent.tags?.includes(tag)) && !explicitTarget && !implicitInteraction) return;
    const tier = intent.actionTier || "safe";
    const harsh = /逼问|威胁|拆穿|公开压|处决|施压|质问|逼迫|羞辱|斥责|强迫|命令|出卖/.test(intent.clean || "");
    const cold = /试探|利用|冷处理|回避|敷衍|隐瞒|撒谎|拒绝|推开|保持距离|套话/.test(intent.clean || "");
    const delta = intent.tags.includes("attack")
      ? (tier === "gamble" ? -12 : -10)
      : intent.tags.includes("vote")
        ? (tier === "gamble" ? -10 : -6)
      : intent.tags.includes("protect")
        ? (tier === "gamble" ? 12 : 8)
        : harsh
          ? (tier === "gamble" ? -12 : -8)
          : cold
            ? (tier === "gamble" ? -6 : -4)
            : intent.tags.includes("public")
              ? (tier === "gamble" ? 8 : 4)
              : implicitInteraction
                ? (harsh ? -8 : cold ? -4 : tier === "gamble" ? 8 : 5)
                : (tier === "gamble" ? 6 : 4);
    effects.relations[targetId] = delta;
    if (implicitInteraction && usesCrowdFacingTone(intent, intent.slotId)) {
      const crowd = getWitnessesForIntent(draftState, intent, [draftState.selectedRole, targetId], intent.location?.code);
      const echo = delta > 0
        ? Math.min(6, Math.max(2, Math.ceil(delta / 2)))
        : Math.max(-6, Math.min(-2, Math.floor(delta / 2)));
      if (echo && crowd.length) {
        crowd.forEach((id) => {
          effects.relationEchoes[id] = clamp((effects.relationEchoes[id] || 0) + echo, -6, 6);
        });
      }
    }
  }

  function advanceNpcPositions(draftState, slotId, visitKey) {
    const currentIndex = SLOT_ORDER.indexOf(slotId);
    const nextSlotId = SLOT_ORDER[Math.min(currentIndex + 1, SLOT_ORDER.length - 1)];
    const nextPositions = normalizeNpcPositions(draftState.npcPositions, nextSlotId, draftState.selectedRole, draftState.playerPosition);
    if (draftState.flags.meruruDead) nextPositions.meruru = "B2";
    if (draftState.flags.patrickAwakened) nextPositions.patrick = nextSlotId.startsWith("5.") ? "D3" : nextPositions.patrick;
    if (visitKey === "A19" && nextPositions.meruru === "A19") nextPositions.meruru = "A20";
    return nextPositions;
  }

  function composeScene(slotId, optionKey) {
    const role = currentRole();
    const slot = SLOT_META[slotId];
    const label = getRoleOptions(role.id, slotId)[optionKey];
    const module = getOptionModule(role.id, slotId, optionKey);
    const intent = analyzeChoice(label, optionKey, slotId, role.id);
    if (module) {
      intent.branchClass = module.branchClass;
      intent.urgency = module.urgency;
      intent.focus = module.focus;
      intent.memoryHooks = module.memoryHooks;
      intent.proseHooks = module.proseHooks;
    }
    const draftState = structuredClone(state);
    const encounterId = chooseEncounter(role.id, slotId, intent, draftState);
    const encounter = ENTITIES[encounterId];
    const location = intent.location;
    const visitKey = location.code || location.name;
    const visitCount = draftState.visits[visitKey] || 0;
    const effects = buildEffects(role.id, slotId, intent, draftState, encounterId);
    const anchorText = buildAnchorBeat(role.id, slotId, intent, encounterId, effects, draftState);
    let paragraphs = [
      buildOpeningParagraph(role.id, slotId, slot, location, visitCount, intent, module, draftState),
      buildEncounterParagraph(role.id, slotId, encounterId, location, intent, draftState, module),
      anchorText,
      buildOutcomeParagraph(role.id, slotId, encounterId, effects, intent, draftState, module),
      buildRippleParagraph(role.id, slotId, encounterId, effects, intent, draftState, module),
      buildModuleContextParagraph(role.id, { module, slotId, intent, encounterId }, draftState),
    ].filter(Boolean);
    let quote = buildQuote(role.id, encounterId, intent, slotId);
    if (role.id === "patrick") {
      paragraphs = trimPatrickParagraphs(paragraphs);
      quote = splitPatrickParagraphText(quote, 120)[0] || normalizeNarrativeText(quote);
    } else if (role.id === "anjie") {
      paragraphs = trimAnjieParagraphs(paragraphs);
      quote = splitRouteParagraphText(quote, 120)[0] || normalizeNarrativeText(quote);
    } else if (PAGED_ROUTE_IDS.has(role.id)) {
      paragraphs = trimRouteParagraphs(paragraphs, getRouteParagraphLimit(role.id));
      quote = splitRouteParagraphText(quote, 120)[0] || normalizeNarrativeText(quote);
    }
    paragraphs = dedupeParagraphList(addStateNarrativeHints(paragraphs, draftState)).map((paragraph) => compressTextByState(paragraph, draftState));
    const effectChips = buildEffectChips(effects);
    if (effects.stats.truth) {
      const truthChipIndex = effectChips.findIndex((chip) => chip.startsWith("真相 "));
      if (truthChipIndex >= 0) {
        effectChips[truthChipIndex] = `真相 ${effects.stats.truth > 0 ? `+${effects.stats.truth}` : effects.stats.truth}`;
      }
    }
    const shortLabel = compactDecisionLabel(role.id, slotId, label, optionKey);
    const summary = `${slotId} · ${shortLabel}`;
    const nextNotice = buildNextNotice(role.id, slotId, encounterId, effects, intent);
    return {
      slotId,
      slot,
      optionKey,
      module,
      optionLabel: label,
      cleanLabel: shortLabel,
      location,
      encounter,
      paragraphs,
      quote,
      effectChips,
      summary,
      nextNotice,
      effects,
    };
  }

  function stripRestLabel(label) {
    return String(label)
      .replace(/\*\*【休息】\*\*/g, "【休息】")
      .replace(/\*\*/g, "")
      .trim();
  }

  function ensureSecondPersonChoice(text) {
    const value = normalizeNarrativeText(text);
    if (!value) return "";
    if (value.startsWith("你") || value.startsWith("【") || value.startsWith("（") || value.startsWith("(")) return value;
    return `你${value}`;
  }

  function getRoleActionDetail(roleId, intent) {
    const source =
      roleId === "anjie"
        ? ANJIE_ACTION_DETAILS
        : roleId === "patrick"
          ? PATRICK_ACTION_DETAILS
          : GENERIC_ROLE_ACTION_DETAILS[roleId] || [];
    return source.find((item) => item.pattern.test(intent.clean)) || null;
  }

  function getRoleSlotBase(roleId, slotId) {
    if (roleId === "anjie") return ANJIE_SLOT_BASE[slotId] || "";
    if (roleId === "patrick") return PATRICK_SLOT_BASE[slotId] || "";
    return GENERIC_ROLE_SLOT_BASES[roleId]?.[slotId] || "";
  }

  function describeSceneVisit(roleId, location, visitCount) {
    if (visitCount > 1) {
      if (roleId === "yamada") return `你第${visitCount + 1}次回到${location.name}，先把脸色压稳。`;
      if (roleId === "debora") return `你第${visitCount + 1}次回到${location.name}，先把眼神放钝。`;
      if (roleId === "ziche") return `你又回到${location.name}，先看门和死角。`;
      return roleId === "patrick"
        ? `你第${visitCount + 1}次回到${location.name}，回声更熟了。`
        : `你第${visitCount + 1}次回到${location.name}，旧脚步和失误更难忽视。`;
    }
    if (visitCount > 0) {
      if (roleId === "yamada") return `你再次走近${location.name}，先想好这回该挂哪张脸。`;
      if (roleId === "debora") return `你又走回${location.name}，先把肩背垮下去。`;
      if (roleId === "ziche") return `你再次靠近${location.name}，先重看退路。`;
      return roleId === "patrick"
        ? `你再次回到${location.name}，这里的气息更沉。`
        : `你再次靠近${location.name}，这地方已经像一份有缺口的笔录。`;
    }
    if (roleId === "yamada") return `你走进${location.name}，先把表情压稳。`;
    if (roleId === "debora") return `你走向${location.name}，先装得不太起眼。`;
    if (roleId === "ziche") return `你走进${location.name}，先扫门和落脚点。`;
    return roleId === "patrick"
      ? `你朝${location.name}走去，先听见一阵回声。`
      : `你朝${location.name}走去，像在把假设推进现场。`;
  }

  function buildRoleFindingSentence(roleId, effects, slotId = "") {
    const stage = String(slotId || "")[0] || "1";
    if (effects.addClues.length) {
      if (roleId === "patrick") {
        return `你带回${effects.addClues.join("、")}，顺手记下它们的死气。`;
      }
      return `你把${effects.addClues.join("、")}直接记进证物序列，连来源和可信度都一并压上去。`;
    }
    if (roleId === "patrick") {
      if (stage === "1") return "你没拿到铁证，只多听见几层回声。";
      if (stage === "2") return "你还没摸到答案，只先记住回声偏向哪边。";
      if (stage === "3") return "你没握住实证，只先听清谁在对死亡说谎。";
      if (stage === "4") return "你还没拿到定论，只先看见谁开始对不上口供。";
      return "你暂时没抓住真相，只把最后几处回声钉稳了。";
    }
    if (roleId === "debora") {
      if (stage === "1") return "你先看清谁在装外行。";
      if (stage === "2") return "你先记牢几处反常。";
      if (stage === "3") return "你先记住谁一见尸体就变调。";
      if (stage === "4") return "你先把几个人的心思摊平。";
      return "你先认清谁会在最后失手。";
    }
    if (roleId === "yamada") {
      if (stage === "1") return "你还没有定论，但先记住了谁的表情先乱。";
      if (stage === "2") return "你还没拼出答案，只先把几处矛盾理进顺序。";
      if (stage === "3") return "你没有亮出判断，只把更关键的破绽收好了。";
      if (stage === "4") return "你还没把话说死，只先看清谁急着要你表态。";
      return "你没有交出结论，只先把最后的风险位置记牢。";
    }
    if (roleId === "fan") {
      if (stage === "1") return "你先看见了谁在怕。";
      if (stage === "2") return "你先看清了谁急着解释。";
      if (stage === "3") return "你先听出谁在躲死者。";
      if (stage === "4") return "你先听出谁开始求生。";
      return "你先知道代价要落去谁身上。";
    }
    if (roleId === "ziche") {
      if (stage === "1") return "你先分清了哪边能走，哪边会出事。";
      if (stage === "2") return "你先把门、工具和风险重新排了一次。";
      if (stage === "3") return "你先看清了哪一处最可能先崩。";
      if (stage === "4") return "你先算出谁会在关键时刻坏事。";
      return "你先把最后几步活路钉住了。";
    }
    if (stage === "1") return "你还没有定论，但先把最初几处疑点记进了同一页。";
    if (stage === "2") return "你还没拼好答案，只先把新的冲突挪进时间线里。";
    if (stage === "3") return "你没有得到终局解释，却先抓到了更危险的缺口。";
    if (stage === "4") return "你还没把真相闭合，只先确认谁的说辞最先崩开。";
    return "你没有拿到完整结论，却已经逼近最后那几块拼图。";
  }

  function buildOutcomeTail(roleId, slotId) {
    if (roleId === "debora") {
      if (slotId === "1.1") return "这地方迟早会逼人露馅。";
      if (slotId === "1.2") return "第一轮试探后，你已不能把所有人都当外行。";
      if (slotId === "1.3") return "审讯室最会把玩笑养成麻烦。";
      if (slotId === "1.4") return "接触越深，你越难继续装慌。";
      if (slotId === "2.1") return "深处的发现迟早会回来找你。";
      if (slotId === "2.2") return "态度一换，圆场就没那么便宜。";
      if (slotId === "2.3") return "和电闸有关的事，后面都会算回逃生里。";
      if (slotId === "2.4") return "谁在演，谁开始急，已经看出来了。";
      if (slotId === "3.1") return "过了这段，你很难再说只是运气好。";
      if (slotId === "3.2") return "裂口一开，装糊涂就站不住了。";
      if (slotId === "3.3") return "尸体一出，所有余地都开始收紧。";
      if (slotId === "3.4") return "临死前的话，最会把旧账一起翻上来。";
      if (slotId === "4.1") return "卡尔再失手一次，票面就会跟着歪。";
      if (slotId === "4.2") return "越近审判，你越难把锋芒藏进笑里。";
      if (slotId === "4.3") return "到白门前，你也得承认自己早卷进去了。";
      if (slotId === "4.4") return "再往后，你连沉默都得算进站位。";
      if (slotId === "5.1") return "警报一响，打哈哈的余地就没了。";
      if (slotId === "5.2") return "收尾阶段，连退一步都像在记账。";
      if (slotId === "5.3") return "最后几段路上，谁也不会再把你的笑话当无害。";
      if (slotId === "5.4") return "到了最后，连侥幸都得一并吞回去。";
      return "这点判断后面还会回来要账。";
    }
    if (roleId === "yamada") {
      if (slotId === "5.2") return "再往前走，你连退让都得算进代价。";
      if (slotId === "5.3") return "到了最后几段路，谁也不会再信你的轻描淡写。";
      if (slotId === "4.4") return "到了投票时，谁都得替自己写下来的名字负责。";
      if (slotId === "1.1" || slotId === "1.2" || slotId === "3.3" || slotId === "5.1") return "";
      return "这一步会改写后面的对话。";
    }
    if (roleId === "fan") {
      if (slotId === "5.4") return "到了白门前，连低声祈祷都像在追问代价。";
      if (slotId === "4.4") return "票一落下去，你就更难把心软和纵容分开。";
      return "你已经没法只把这事当安慰。";
    }
    if (roleId === "ziche") {
      if (slotId === "5.4") return "白门只会给还抓得住节奏的人留路。";
      if (slotId === "4.4") return "投票之后，再慢一步都可能被人甩开。";
      if (slotId === "5.1") return "警报一响，慢一步就可能没命。";
      return "只要节奏还在手里，你就还有机会。";
    }
    if (roleId === "patrick") {
      if (slotId === "5.2" || slotId === "5.3") return "你带回来的更多是一种压迫感。";
      if (slotId === "4.4") return "投票之后，人和回声都会站得更开。";
      return "你先把这份结果收住。";
    }
    return "";
  }

  function describeBranchClass(branchClass) {
    const labels = {
      rest: "休整",
      conflict: "冲突",
      system: "系统",
      encounter: "相遇",
      discovery: "发现",
      exploration: "探索",
      verdict: "审判",
      ending: "终局",
      anchor: "主干",
    };
    return labels[branchClass] || "事件";
  }

  function buildModuleContextParagraph(roleId, scene, draftState) {
    const module = scene.module;
    if (!module) return "";
    const slotId = scene.slotId || "";
    if (roleId === "anjie" && new Set(["3.3", "5.1"]).has(slotId)) return "";
    if (roleId === "patrick" && new Set(["1.1", "3.3", "4.4", "5.1", "5.4"]).has(slotId)) return "";
    const branchText = buildBranchAftertaste(roleId, module, draftState);
    const hookText = buildHookAftertaste(roleId, module, scene, draftState);
    const memoryText = buildMemoryAftertaste(roleId, module, draftState);
    if (roleId === "yamada") {
      return buildYamadaModuleContextParagraph(scene, draftState);
    }
    if (roleId === "debora" || roleId === "fan" || roleId === "ziche") {
      return "";
    }
    if (roleId === "patrick") {
      return buildPatrickCompactParagraph([branchText, hookText, memoryText], 190);
    }
    if (roleId === "anjie") {
      return buildRouteCompactParagraph([branchText, hookText, memoryText], 190);
    }
    return compactRouteParagraph(roleId, [branchText, hookText, memoryText], 190);
  }

  function buildYamadaModuleContextParagraph(scene, draftState) {
    const module = scene.module;
    if (!module) return "";
    const motifs = new Set(module.motifs || []);
    const target = scene.encounter?.short || "";
    const slotId = scene.slotId || "";
    if (["1.1", "1.2", "3.3", "4.4", "5.1"].includes(slotId)) return "";
    const lines = [];

    if (module.branchClass === "verdict") lines.push("票一落下，别人之后提起你时会先提这一步。");
    else if (module.branchClass === "anchor") lines.push("从这里开始，你已经没法只站在边上看。");
    else if (module.branchClass === "rest") return "";
    else if (module.branchClass === "encounter" && target) lines.push(`${target}之后再看你时，不会还按刚才那套印象。`);
    else if (module.branchClass === "discovery") lines.push("你带走的不是结论，是一份以后会翻出来核对的印象。");

    if (motifs.has("care")) lines.push("一旦真去护谁，你就很难再把自己演成只是顺手。");
    else if (motifs.has("concealment")) lines.push("你前面留的空白，后面都得拿别的话去补。");
    else if (motifs.has("alliance")) lines.push("同盟一成，别人就会顺手替你安排站位。");
    else if (motifs.has("corpse")) lines.push("见过血后，你再装不懂就会显得太假。");
    else if (motifs.has("vote")) lines.push("投票会把还没说破的东西全逼到台面上。");

    if (draftState.flags.emilyProtected && slotId === "5.2") lines.push("艾米莉还跟着你时，你就没法只按自己的活路算。");

    return lines.length ? compactRouteParagraph("yamada", lines, 64) : "";
  }

  function buildBranchAftertaste(roleId, module, draftState) {
    const branch = module.branchClass;
    const motifText = buildMotifAftertaste(roleId, module, draftState, "branch");
    const urgencyText = module.urgency >= 4
      ? "你也知道，这不是可以慢慢拖延的小动作。它一旦被做出来，就会逼后面的局势提前表态。"
      : module.urgency <= 2
        ? "它看上去不像会立刻决定生死，偏偏正适合在后面的时段里慢慢发酵成更难处理的后果。"
        : "它暂时还没把全场推到临界点，却已经悄悄把几条后路改得和先前不一样了。";
    const focusText = module.focus
      ? `你甚至能感觉到，这一步的重心已经很明确地落在“${formatFocusLabel(module.focus).replace("：", " · ")}”上。`
      : "";
    const riskText =
      branch === "rest"
        ? "这段停顿看起来像给自己喘息，实际上更像把别处的脚步声先一步放大。"
        : branch === "conflict"
          ? "这一步把敌意拧得更紧，后面再见面时，连沉默都会带着刀口。"
          : branch === "verdict"
            ? "票纸的阴影已经提前罩了下来，接下来的每一次对视都开始像预先写好的供词。"
            : branch === "anchor"
              ? "这不是普通的移动，而是把下一轮主干事件推向另一种切面。"
              : "这一步没有当场定局，却已经悄悄改了后面几段相遇的口气。";
    const fatigueText = draftState.stats.mp <= Math.max(1, Math.floor(draftState.maxStats.mp / 3)) ? "你已经开始觉得每一步都在透支后面的余地。" : "";
    if (roleId === "fan") return `你把这一步看成一段试炼的余震。${riskText}${urgencyText}${focusText}${fatigueText}${motifText}`;
    if (roleId === "ziche") return `你只关心它改了哪些位置、哪些人和哪些筹码。${riskText}${urgencyText}${focusText}${fatigueText}${motifText}`;
    if (roleId === "yamada") return `这一步先替你换了一层面具。${riskText}${urgencyText}${focusText}${fatigueText}${motifText}`;
    if (roleId === "anjie") return `你会把这一步记成一个必须回查的节点。${riskText}${urgencyText}${focusText}${fatigueText}${motifText}`;
    if (roleId === "debora") return `你很清楚这种小动作最会长尾。${riskText}${urgencyText}${focusText}${fatigueText}${motifText}`;
    return roleId === "patrick"
      ? `你知道这一步已经留痕。${riskText}${urgencyText}${focusText}${fatigueText}${motifText}`
      : `你听见这一步在墙里留下了回声。${riskText}${urgencyText}${focusText}${fatigueText}${motifText}`;
  }

  function buildHookAftertaste(roleId, module, scene, draftState) {
    const hooks = new Set(module.proseHooks || []);
    const roomCode = Array.from(hooks).find((hook) => hook.startsWith("prose:room:"))?.slice("prose:room:".length) || module.location?.code || "";
    const roomLabel = roomCode ? describeRoomLabel(roomCode) : module.location?.name || "";
    const targetNames = (module.targets || []).map((id) => ENTITIES[id]?.short).filter(Boolean);
    const hookLines = [];
    if (hooks.has("prose:rest")) {
      hookLines.push(roleId === "patrick"
        ? "静下来以后，亡者的回声会更清楚。"
        : roleId === "ziche"
          ? "一旦停下来，你就会更清楚地听见远处的金属声和脚步。"
          : roleId === "anjie"
            ? "休息不是空白，只是给后续推理留一个能回头比对的空档。"
            : roleId === "debora"
              ? "你知道，越是说自己只是休息，越容易想起不该想起的东西。"
              : "你一慢下来，就更容易听见自己真正的心思。");
    }
    if (hooks.has("prose:encounter")) {
      hookLines.push(roleId === "yamada"
        ? "这类相遇会让你后面更难全身而退。"
        : roleId === "patrick"
          ? "和活人碰面后，你会先记住对方的气息有没有变。"
          : "每一次正面相遇都会把之后的站位、口气和票向先拧出一点形状。");
    }
    if (hooks.has("prose:scene")) {
      hookLines.push(roleId === "anjie"
        ? "你会把房间、痕迹和物件全都重新编号，因为真正会说话的从来不只是人。"
        : roleId === "ziche"
          ? "你更愿意把这地方当成一张可以拆解的地图，而不是一处单纯的怪谈现场。"
          : roleId === "patrick"
            ? "房间会先把痕迹交给你，再把答案拖到后面。"
            : "现场会留下比人更诚实的痕迹，灰尘、气味和破口都会替后面的剧情补证。");
    }
    if (hooks.has("prose:conflict")) {
      hookLines.push(roleId === "ziche"
        ? "冲突不是情绪问题，是距离和先手问题。"
        : roleId === "fan"
          ? "冲突一旦发生，赦免与惩罚就会被迫一起站上台面。"
          : "这类动作会让敌意长出形状，之后再遮掩就没那么容易了。");
    }
    if (hooks.has("prose:verdict")) {
      hookLines.push(roleId === "anjie"
        ? "投票不只是票数，它会把先前积下的怀疑一次性翻到账面上。"
        : roleId === "patrick"
          ? "到了这一步，沉默也会被算进票里。"
          : "票纸落下前，恐惧会先替每个人选好借口。");
    }
    if (hooks.has("prose:patrick")) {
      hookLines.push(roleId === "patrick"
        ? "你自己的名字也开始变重。"
        : "派翠克这个名字在之后会越来越沉。");
    }
    if (hooks.has("prose:karl")) {
      hookLines.push(roleId === "anjie"
        ? "卡尔每一次靠近都像把旧伤重新按亮。"
        : "卡尔的火气会继续烧，而且越烧越难收场。");
    }
    if (hooks.has("prose:meruru")) {
      hookLines.push(roleId === "patrick"
        ? "梅露露身上的光，你一时还忘不掉。"
        : "梅露露这个名字会继续挂在空气里。");
    }
    if (roomLabel) {
      hookLines.push(roleId === "debora"
        ? `${roomLabel}的气味会留到下一轮，让你一闻就知道自己来过。`
        : roleId === "ziche"
          ? `${roomLabel}说明你已经把这片区域摸熟了一点，后面再来就不容易被骗。`
          : roleId === "patrick"
            ? `${roomLabel}会把这一步的回声多留一阵。`
            : roleId === "yamada"
              ? `${roomLabel}会替这一步留下更长的余味。`
              : `${roomLabel}会把这一段动作留下痕迹。`);
    }
    if (targetNames.length) {
      hookLines.push(roleId === "yamada"
        ? `${targetNames.join("、")}的反应已经被你记住。`
        : roleId === "fan"
          ? `${targetNames.join("、")}的名字会在你心里继续回响，像一份尚未完成的代祷。`
          : roleId === "patrick"
            ? `${targetNames.join("、")}的气息，你之后还会认得出来。`
            : `${targetNames.join("、")}会把这次接触继续带进后面的时段里。`);
    }
    if (module.urgency >= 4) {
      hookLines.push(roleId === "ziche"
        ? "你知道这不是能慢慢观察到自然结束的动作，它会很快把人与人的节奏重新拧紧。"
        : roleId === "fan"
          ? "你隐约明白，这一步会比表面更快地向别人索取回应。"
          : roleId === "patrick"
            ? "这一步的后效来得很快，下一轮就会抬头。"
            : "这一步的后效来得很快。");
    }
    if (!hookLines.length) return "";
    return ` ${hookLines.join(" ")}`;
  }

  function buildMotifAftertaste(roleId, module, draftState, stage) {
    const motifs = new Set(module.motifs || []);
    const lines = [];
    if (motifs.has("broadcast")) {
      lines.push(roleId === "patrick"
        ? "广播会把未说尽的话逼成回音。"
        : "广播一响，别人的私语也会被迫长出重量。");
    }
    if (motifs.has("prayer")) {
      lines.push(roleId === "fan"
        ? "祷告不是停下来，而是把恐惧翻成另一种可以承受的语法。"
        : "这类念头会把空气里的沉默拉得更长。");
    }
    if (motifs.has("care")) {
      lines.push(roleId === "yamada"
        ? "照顾别人会让你更像无害的一边。"
        : "温柔说出口后，就会变成下注。");
    }
    if (motifs.has("surveillance")) {
      lines.push(roleId === "ziche"
        ? "你总会先看见别人没留神的背面。"
        : "注视本身就足够改变后面的站位。");
    }
    if (motifs.has("weapon")) {
      lines.push(roleId === "ziche"
        ? "武器在你眼里不是象征，是下一秒能不能活。"
        : "只要手里有器具，叙事就会更快走向现实。");
    }
    if (motifs.has("generator")) {
      lines.push(roleId === "anjie"
        ? "电路恢复时，逻辑就有了可被验证的支点。"
        : "发电机不是修理题，是争取时间的门闩。");
    }
    if (motifs.has("ritual")) {
      lines.push(roleId === "patrick"
        ? "仪式会把活人和亡者之间那层皮削薄。"
        : "这些字眼总会把简单的恐惧推向更深的层次。");
    }
    if (motifs.has("corpse")) {
      lines.push(roleId === "debora"
        ? "尸体会让每个人的表情都暴露出一点职业习惯。"
        : "死亡一旦被摆上台面，所有借口都会更像借口。");
    }
    if (motifs.has("sky")) {
      lines.push(roleId === "patrick"
        ? "那片天空会提醒你，外面也未必安全。"
        : "你抬头时，连方向感都得重新学。");
    }
    if (motifs.has("vote")) {
      lines.push(roleId === "anjie"
        ? "投票就是把态度写成不可撤回的记录。"
        : "票纸落下时，关系会先于结局裂开。");
    }
    if (motifs.has("alliance")) {
      lines.push(roleId === "yamada"
        ? "同盟看似柔软，实际上最会收网。"
        : "临时结盟往往只是更大的误判前奏。");
    }
    if (motifs.has("concealment")) {
      lines.push(roleId === "yamada"
        ? "伪装会帮你活下去，也会让你更难做自己。"
        : "藏起来的那部分，总会在关键时刻先出卖你。");
    }
    if (motifs.has("pressure")) {
      lines.push(roleId === "anjie"
        ? "压迫感会把每一句话都拧成证词。"
        : "逼迫一旦开始，退路就会变得很短。");
    }
    if (motifs.has("escape")) {
      lines.push(roleId === "ziche"
        ? "逃生路线不值钱，能跑通的才值钱。"
        : "真正重要的是门外还有没有下一口气。");
    }
    if (motifs.has("sacrifice")) {
      lines.push(roleId === "fan"
        ? "献祭这个词一旦出现，就再也不像抽象概念。"
        : "牺牲会把所有人都逼到更难看的位置。");
    }
    if (motifs.has("rest") && stage === "opening") {
      lines.push(roleId === "debora"
        ? "停下来时，旧伤最先醒。"
        : "安静本身也会留下痕迹。");
    }
    if (getTruthTier(draftState.stats.truth) >= 3) {
      lines.push(roleId === "anjie"
        ? "真相已经够多，接下来要看的只是它们如何互相咬合。"
        : "你已经离看清更近了一点，但也更难装作无知。");
    }
    return lines.length ? ` ${lines.join(" ")}` : "";
  }

  function buildMemoryAftertaste(roleId, module, draftState) {
    const hooks = module.memoryHooks || [];
    const memories = [];
    if (hooks.some((item) => item.startsWith("visit:"))) {
      const roomCode = hooks.find((item) => item.startsWith("visit:"))?.slice("visit:".length);
      if (roomCode) {
        memories.push(roleId === "anjie"
          ? `${describeRoomLabel(roomCode)}会在你的记录里多出一行标记。`
          : roleId === "patrick"
            ? `${describeRoomLabel(roomCode)}的回声会比别处留得更久。`
            : `${describeRoomLabel(roomCode)}会变成你之后路过时自动想起的地方。`);
      }
    }
    if (hooks.includes("system:generator")) {
      memories.push(roleId === "ziche"
        ? "发电机的嗡鸣让你更确定：只要电路还在，门就还有被撬开的可能。"
        : "发电机的声音会把后面几段追逐、停顿和广播都衬得更急。");
    }
    if (hooks.includes("system:vote")) {
      memories.push(roleId === "anjie"
        ? "投票这件事已经被你归档成了一条必须追责的线。"
        : "投票一旦被写进记忆，之后每一句辩解都会变得更硬。");
    }
    if (hooks.includes("inner:rest")) {
      memories.push(roleId === "debora"
        ? "休息时冒出来的不是安宁，而是你压住的旧账。"
        : "安静会放大你不想听见的部分。");
    }
    if (hooks.includes("memory:eavesdrop")) {
      memories.push("你会记得那次偷听，哪怕只记得半句，也足够在后面改写判断。");
    }
    if (hooks.includes("memory:track")) {
      memories.push(roleId === "ziche"
        ? "你已经开始习惯盯住别人走过的痕迹，而不是只看他们说了什么。"
        : "追踪留下的不是答案，而是更具体的怀疑。");
    }
    if (draftState.stats.mp <= 1) {
      memories.push(roleId === "patrick"
        ? "你精力见底后，更容易听见不该听见的呼吸。"
        : "你的消耗已经太明显了，后面会更难遮掩。");
    }
    return memories.length ? ` ${memories.join(" ")}` : "";
  }

  function describeRoomLabel(code) {
    if (!code) return "";
    const item = LOCATION_GLOSSARY.find((entry) => entry.code === code);
    return item ? `${item.code}${item.name ? `·${item.name}` : ""}` : code;
  }

  function normalizeNarrativeText(text) {
    return `${text || ""}`.replace(/\s+/g, " ").trim();
  }

  function splitNarrativeSentences(text) {
    const normalized = normalizeNarrativeText(text);
    if (!normalized) return [];
    return normalized.match(/[^。！？；!?]+[。！？；!?]?/g)?.map((item) => item.trim()).filter(Boolean) || [normalized];
  }

  function buildSentenceSimilarityKey(text) {
    const normalized = normalizeNarrativeText(text).replace(/[。！？；!?，、：“”"'‘’《》〈〉（）()【】\s]/g, "");
    if (!normalized) return "";
    const compact = normalized
      .replace(/投票前夕|投票前夜|投票到了|投票阶段|投票之后/g, "投票")
      .replace(/白门前|站到白门前|到了白门前|越靠近白门/g, "白门")
      .replace(/不能再只当|已经不能只做|已经不能只当|不再只是|没法再只当/g, "不能只当")
      .replace(/打圆场的大人|替大家圆场的人|替大家挡话的人|看起来最会退让的人|旁观的人/g, "圆场人")
      .replace(/之后每次有人提起审判|这一步之后|白门一近|投票之后/g, "后续回响")
      .replace(/更容易被人回想起|就会跟着你往后拖|很难再把自己摘得干净|都会先想自己那句解释/g, "后续回响")
      .replace(/越难继续把锋芒收进笑里|越难分开求生和赎罪/g, "难再收住")
      .replace(/站到白门前你得承认自己也早被卷进局里了|站到白门前你得承认自己早被卷进局里了/g, "白门卷入");
    return compact;
  }

  function splitPatrickClauses(text) {
    const normalized = normalizeNarrativeText(text);
    if (!normalized) return [];
    return normalized.match(/[^，、：,:]+[，、：,:]?/g)?.map((item) => item.trim()).filter(Boolean) || [normalized];
  }

  function splitPatrickParagraphText(text, limit = PATRICK_PARAGRAPH_LIMIT) {
    const normalized = normalizeNarrativeText(text);
    if (!normalized) return [];
    const sentenceChunks = splitNarrativeSentences(normalized).flatMap((sentence) => {
      if (sentence.length <= limit) return [sentence];
      const clauses = splitPatrickClauses(sentence);
      if (clauses.length <= 1) {
        const hardChunks = [];
        for (let index = 0; index < sentence.length; index += limit) {
          hardChunks.push(sentence.slice(index, index + limit));
        }
        return hardChunks;
      }
      const pieces = [];
      let current = "";
      clauses.forEach((clause) => {
        if (!current) {
          current = clause;
          return;
        }
        if ((current + clause).length <= limit) {
          current += clause;
          return;
        }
        pieces.push(current);
        current = clause;
      });
      if (current) pieces.push(current);
      return pieces;
    });
    const paragraphs = [];
    let current = "";
    sentenceChunks.forEach((chunk) => {
      if (!current) {
        current = chunk;
        return;
      }
      if ((current + chunk).length <= limit) {
        current += chunk;
        return;
      }
      paragraphs.push(current);
      current = chunk;
    });
    if (current) paragraphs.push(current);
    return paragraphs.map((item) => normalizeNarrativeText(item)).filter(Boolean);
  }

  function splitRouteParagraphText(text, limit = ROUTE_PARAGRAPH_LIMIT) {
    return splitPatrickParagraphText(text, limit);
  }

  function buildRouteCompactParagraph(parts, limit = 220) {
    const compact = [];
    const seen = new Set();
    parts.forEach((part) => {
      splitRouteParagraphText(part, limit).forEach((chunk) => {
        const normalized = normalizeNarrativeText(chunk);
        if (!normalized || seen.has(normalized)) return;
        const merged = compact.join("") + normalized;
        if (merged.length <= limit || !compact.length) {
          compact.push(normalized);
          seen.add(normalized);
        }
      });
    });
    return normalizeNarrativeText(compact.join(""));
  }

  function dedupeParagraphList(paragraphs) {
    return (Array.isArray(paragraphs) ? paragraphs : [])
      .map((paragraph) => dedupeJoinedNarrative(paragraph))
      .filter(Boolean);
  }

  function compactRouteParagraph(roleId, parts, limit = ROUTE_PARAGRAPH_LIMIT) {
    const compact = buildRouteCompactParagraph(parts, limit);
    if (!compact) return "";
    if (roleId === "patrick") return compact;
    return compact.length > limit ? splitRouteParagraphText(compact, limit)[0] || compact : compact;
  }

  function buildLooseRouteParagraph(parts) {
    return normalizeNarrativeText(parts.filter(Boolean).join(" "));
  }

  function buildYamadaRouteParagraph(parts) {
    return normalizeNarrativeText(parts.filter(Boolean).join(" "));
  }

  function getRouteParagraphLimit(roleId) {
    return COMPACT_RESULT_ROUTE_IDS.has(roleId) ? 170 : ROUTE_PARAGRAPH_LIMIT;
  }

  function trimRouteParagraphs(paragraphs, limit = ROUTE_PARAGRAPH_LIMIT) {
    const result = [];
    const seen = new Set();
    paragraphs.forEach((paragraph) => {
      splitRouteParagraphText(paragraph, limit).forEach((chunk) => {
        const normalized = normalizeNarrativeText(chunk);
        if (!normalized || seen.has(normalized)) return;
        seen.add(normalized);
        result.push(normalized);
      });
    });
    return result.slice(0, 6);
  }

  function packResultPages(paragraphs, roleId = "") {
    const items = Array.isArray(paragraphs) ? paragraphs.map((paragraph) => normalizeNarrativeText(paragraph)).filter(Boolean) : [];
    if (!items.length) return [[]];
    if (items.length === 1) return [items];
    const lengths = items.map((paragraph) => paragraph.length);
    const total = lengths.reduce((sum, value) => sum + value, 0) + Math.max(0, items.length - 1) * 2;
    let splitIndex = 1;
    let bestGap = Infinity;
    let left = 0;
    for (let index = 1; index < items.length; index += 1) {
      left += lengths[index - 1];
      const leftTotal = left + Math.max(0, index - 1) * 2;
      const rightTotal = total - leftTotal - 2;
      const gap = Math.abs(leftTotal - rightTotal);
      if (gap < bestGap) {
        bestGap = gap;
        splitIndex = index;
      }
    }
    return [
      items.slice(0, splitIndex),
      items.slice(splitIndex),
    ].filter((page) => page.length);
  }

  function getRouteResultPages(scene, roleId = "") {
    const paragraphs = Array.isArray(scene?.paragraphs) ? scene.paragraphs.filter(Boolean) : [];
    return packResultPages(paragraphs, roleId);
  }

  function buildPatrickCompactParagraph(parts, limit = 220) {
    return buildRouteCompactParagraph(parts, limit);
  }

  function trimPatrickParagraphs(paragraphs) {
    const groupedParagraphs = paragraphs.length >= 6
      ? [
          paragraphs[0],
          paragraphs[1],
          `${paragraphs[2]}${paragraphs[3]}`,
          `${paragraphs[4]}${paragraphs[5]}`,
        ]
      : paragraphs;
    const result = [];
    const seen = new Set();
    groupedParagraphs.forEach((paragraph) => {
      splitPatrickParagraphText(paragraph, PATRICK_PARAGRAPH_LIMIT).forEach((chunk) => {
        const normalized = normalizeNarrativeText(chunk);
        if (!normalized || seen.has(normalized)) return;
        seen.add(normalized);
        result.push(normalized);
      });
    });
    return result.slice(0, 6);
  }

  function trimAnjieParagraphs(paragraphs) {
    return trimRouteParagraphs(paragraphs, ROUTE_PARAGRAPH_LIMIT);
  }

  function getPatrickResultPages(scene) {
    return getRouteResultPages(scene, "patrick");
  }

  function getAnjieResultPages(scene) {
    return getRouteResultPages(scene, "anjie");
  }

  function getPagedResultPages(scene, roleId = "") {
    return getRouteResultPages(scene, roleId);
  }

  function buildRestIntrospection(roleId, slotId, location, draftState) {
    const base = SLOT_STAKES[slotId]?.rest || "";
    const roomText = location?.name || "这里";
    if (roleId === "fan") {
      return `${base}你把手指抵在掌心，先确认疼痛还肯不肯替你作证。${roomText}里的寒意让你更清楚，这场试炼没有人会替你收尾。`;
    }
    if (roleId === "ziche") {
      return `${base}你没有真的放松，只是把动作降到最低。${roomText}的墙、门和回声都被你重新过了一遍，至少现在还有东西能用。`;
    }
    if (roleId === "yamada") {
      return `${base}你先确认笑意、呼吸和视线都还在安全线内。${roomText}越安静，你越清楚自己不能让脸先露出真相。`;
    }
    if (roleId === "anjie") {
      return `${base}你让笔尖短暂离开纸面，强迫自己先把呼吸调匀。可只要一闭眼，房间编号、人物站位、时间顺序和互相矛盾的证词就会自动在脑内重排。${roomText}没有给你真正的安全感，它只给了你一个更适合整理推理的空白页。你害怕的从来不只是怪异本身，而是有一天连逻辑都不再肯替你挡住恐惧。`;
    }
    if (roleId === "debora") {
      return `${base}你把肩膀往墙上一靠，先摆出一副快撑不住的样子。可没人盯着时，你脑子里先冒出来的还是旧现场和旧失误。`;
    }
    if (roleId === "patrick") {
      const lead = buildPatrickCompactParagraph([base], 100);
      return `${lead}你把呼吸放轻，先分清靠近的是风声、脚步，还是亡者。${roomText}越安静，越容易漏掉真正该记住的那一下动静。`;
    }
    return base;
  }

  function buildRoleModulePassage(roleId, slotId, stage, module, draftState, encounterId) {
    if (!module) return "";
    if (roleId === "anjie") return buildAnjieModulePassage(slotId, stage, module, draftState, encounterId);
    if (roleId === "patrick") return buildPatrickModulePassage(slotId, stage, module, draftState, encounterId);
    if (roleId === "yamada") return buildYamadaModulePassage(slotId, stage, module, draftState, encounterId);
    if (roleId === "debora") return buildDeboraModulePassage(slotId, stage, module, draftState, encounterId);
    if (roleId === "fan") return buildFanModulePassage(slotId, stage, module, draftState, encounterId);
    if (roleId === "ziche") return buildZicheModulePassage(slotId, stage, module, draftState, encounterId);
    return "";
  }

  function buildAnjieModulePassage(slotId, stage, module, draftState, encounterId) {
    const motifs = new Set(module.motifs || []);
    const target = encounterId ? ENTITIES[encounterId]?.short || "" : "";
    const room = module.location?.name || "这里";
    const lines = [];
    if (stage === "opening") {
      if (motifs.has("surveillance")) lines.push(`${room}里的每一次停顿都该被编号。谁先看谁、谁先移开视线、谁在话尾多吞了一次口水，这些都比空话更接近真相。`);
      if (motifs.has("generator")) lines.push(`发电机、门闩和密码让你安心，因为它们至少服从因果。你需要这种还能用步骤解释的东西。`);
      if (motifs.has("ritual")) lines.push(`仪式和隐喻会把证据边界磨掉。你必须亲自确认，它们到底只是障眼法，还是这栋楼真正的语言。`);
      if (motifs.has("concealment")) lines.push(`最让你警惕的不是动作本身，而是动作背后的留白。越像无害的东西，越值得多看一眼。`);
      if (motifs.has("alliance")) lines.push(`关系在这里不是附属变量。谁先靠近谁，都会在后面的票向里回头算账。`);
    }
    if (stage === "encounter") {
      if (motifs.has("care") && target) lines.push(`${target}递来的善意不能直接当真，但也不能浪费。你先看口气，再看他为什么偏偏在这时靠近。`);
      if (motifs.has("pressure") && target) lines.push(`你和${target}之间的空气会立刻变硬。最先开裂的往往不是逻辑，而是姿态。`);
      if (motifs.has("corpse") && target) lines.push(`只要谈到尸体、凶器或案发现场，${target}的惊慌会先于证词露出来。你盯的就是那一秒空白。`);
      if (motifs.has("vote") && target) lines.push(`你会在说话的同时想到票纸，因为这里的每次接触都在提前积累票向。`);
      if (motifs.has("prayer") && target) lines.push(`一旦对方拿祷词或神意解释现实，你的警惕就会上升。模糊语言最会替恐惧遮羞。`);
    }
    if (stage === "outcome") {
      if (motifs.has("surveillance")) lines.push(`这类收集不会立刻给你答案，却会替你省下之后回头核对的力气。`);
      if (motifs.has("generator")) lines.push(`机关、线路和密码一推进，你会暂时稳一点，因为至少还有一部分世界服从顺序。`);
      if (motifs.has("alliance")) lines.push(`最难处理的不是线索，而是关系被推动后留下的连锁反应。`);
      if (motifs.has("concealment")) lines.push(`你必须一边读别人的谎，一边决定自己该保留多少真话。`);
    }
    if (stage === "ripple") {
      if (motifs.has("vote")) lines.push(`之后只要再有人提起“该相信谁”，这一步就会被重新拽出来。票向早在接触时就开始写草稿。`);
      if (motifs.has("corpse")) lines.push(`死亡一旦进入时序，整条时间线都会变得更难清理。`);
      if (motifs.has("escape")) lines.push(`这一步哪怕只让你离出口近了一点，也已经改写了你对取舍的顺序。`);
    }
    lines.push(...buildAnjieSlotStageLines(slotId, stage, draftState, encounterId));
    lines.push(...buildAnjieAnchorOverlayLines(slotId, stage, draftState, encounterId));
    return lines.length ? ` ${lines.join(" ")}` : "";
  }

  function buildPatrickModulePassage(slotId, stage, module, draftState, encounterId) {
    const motifs = new Set(module.motifs || []);
    const target = encounterId ? ENTITIES[encounterId]?.short || "" : "";
    const room = module.location?.name || "这里";
    const lines = [];
    if (stage === "opening") {
      if (motifs.has("ritual")) lines.push(`${room}里还留着仪式痕迹。`);
      if (motifs.has("corpse")) lines.push("死气一冒出来，你就知道这里不干净。");
      if (motifs.has("sky")) lines.push("那片天一抬头就压下来。");
      if (motifs.has("generator")) lines.push("发电机的声调像悼词。");
      if (motifs.has("rest")) lines.push("你停下，是为了听清。");
    }
    if (stage === "encounter") {
      if (motifs.has("care") && target) lines.push(`你先看${target}有没有稳住。`);
      if (motifs.has("alliance") && target) lines.push("这更像暂时并肩。");
      if (motifs.has("pressure") && target) lines.push("一提处决，空气就闷。");
      if (motifs.has("corpse") && target) lines.push(`一谈死者，${target}身上的光就会变。`);
      if (motifs.has("concealment") && target) lines.push(`你知道${target}还留着一层没给人看。`);
    }
    if (stage === "outcome") {
      if (motifs.has("ritual")) lines.push("答案没来，低语先近了。");
      if (motifs.has("care")) lines.push("谁要是因你安静下来，你接住的就不只是信任。");
      if (motifs.has("sky")) lines.push("你带回来的更多是一种压迫感。");
      if (motifs.has("generator")) lines.push("门能开，不代表后果会轻。");
    }
    if (stage === "ripple") {
      if (motifs.has("corpse")) lines.push("死者离开视线，也不会安静。");
      if (motifs.has("alliance")) lines.push("你替谁停下，后面都会回来算账。");
      if (motifs.has("sacrifice")) lines.push("一碰到牺牲，后面的选择都会斜。");
    }
    const slotLines = buildPatrickSlotStageLines(slotId, stage, draftState, encounterId);
    const overlayLines = buildPatrickAnchorOverlayLines(slotId, stage, draftState, encounterId);
    const compact = buildPatrickCompactParagraph([...lines, ...slotLines, ...overlayLines], 220);
    return compact ? ` ${compact}` : "";
  }

  function buildYamadaModulePassage(slotId, stage, module, draftState, encounterId) {
    const motifs = new Set(module.motifs || []);
    const target = encounterId ? ENTITIES[encounterId]?.short || "" : "";
    const room = module.location?.name || "这里";
    const lines = [];
    const anchoredSlots = new Set(["3.3", "4.4", "5.1", "5.4"]);
    const slotLines = buildYamadaSlotStageLines(slotId, stage, draftState, encounterId);
    const overlayLines = buildYamadaAnchorOverlayLines(slotId, stage, draftState, encounterId);
    const push = (text) => {
      if (!text || lines.includes(text)) return;
      lines.push(text);
    };

    if (stage === "opening") {
      if (!anchoredSlots.has(slotId)) {
        push(slotLines[0]);
        push(overlayLines[0]);
      }
      if (!lines.length) {
        if (motifs.has("care")) push("一碰到艾米莉，你原本预备好的客套就没那么好用了。");
        else if (motifs.has("surveillance")) push(`${room}越安静，你越容易分清谁是在观察，谁是在硬撑。`);
        else if (motifs.has("concealment")) push("你先挑最安全的说法，把真正想问的往后压。");
        else if (motifs.has("alliance")) push("一牵扯同盟，你先算站过去之后要替谁背锅。");
        else if (motifs.has("rest")) push("停下来时，你先确认呼吸和眼神有没有露出不该露的东西。");
      }
    }
    if (stage === "encounter") {
      if (!anchoredSlots.has(slotId)) {
        push(slotLines[0]);
        push(overlayLines[0]);
      }
      if (!lines.length) {
        if (motifs.has("care") && target) push(`一面对${target}，你就会先想办法把场面压软。`);
        else if (motifs.has("pressure") && target) push(`真要逼问时，你反而会把声音放得更轻，让${target}自己把话漏出来。`);
        else if (motifs.has("surveillance") && target) push(`比起${target}说了什么，你更记得那一下没接上的停顿。`);
        else if (motifs.has("alliance") && target) push("结盟对你来说只是临时借位，借完迟早要还。");
      }
    }
    if (stage === "outcome") {
      if (!anchoredSlots.has(slotId)) {
        push(slotLines[0]);
        push(overlayLines[0]);
      }
      if (!lines.length) {
        if (motifs.has("care")) push("最累的不是照顾谁，是你又没忍住认真了一瞬。");
        else if (motifs.has("concealment")) push("你暂时把这步遮过去了，可后面总有人会回头对账。");
        else if (motifs.has("alliance")) push("这次结果会逼你重排谁能拉、谁只能防。");
        else if (motifs.has("corpse")) push("一旦见血，你再想装成没经验就太费力了。");
      }
    }
    if (stage === "ripple") {
      push(slotLines[0]);
      push(overlayLines[0]);
      if (!lines.length) {
        if (motifs.has("care")) push("这份靠近之后很难再退回普通礼貌。");
        else if (motifs.has("concealment")) push("你前面铺的说法，会逼后面的动作一起跟着走。");
        else if (motifs.has("alliance")) push("同盟一出现，别人就会顺手替你安排立场。");
      }
    }

    return lines.length ? ` ${compactRouteParagraph("yamada", lines, stage === "opening" ? 72 : stage === "encounter" ? 78 : 72)}` : "";
  }

  function buildDeboraModulePassage(slotId, stage, module, draftState, encounterId) {
    const motifs = new Set(module.motifs || []);
    const target = encounterId ? ENTITIES[encounterId]?.short || "" : "";
    const lines = [];
    const push = (text) => {
      if (!text || lines.includes(text)) return;
      lines.push(text);
    };
    if (stage === "opening") {
      if (slotId === "2.4") push("这时候一句话只要说得太准，就会显得你不该这么懂。");
      else if (slotId === "3.3") push("尸体一出现，你最先防的反而是自己的眼神。");
      else if (slotId === "4.4") push("投票房越像现场整理，你越不敢露出熟门熟路的样子。");
      else if (slotId.startsWith("5.")) push("越靠近白门，你越难再靠玩笑把自己藏起来。");
      else if (motifs.has("concealment")) push("你先把慌张摆在外面，好让真正会看的人先忽略你。");
      else if (motifs.has("weapon")) push("手一碰工具，你就知道自己还没把那点熟练忘干净。");
      else if (motifs.has("alliance")) push("一谈合作，你先想的不是好不好，而是谁会在后面甩锅。");
      else if (motifs.has("rest")) push("一停下，旧事和旧现场就会一起往上冒。");
    }
    if (stage === "encounter") {
      if (slotId === "2.4" && target) push(`这时候和${target}说话，更像先替后面留一份口供。`);
      else if (slotId === "3.3" && target) push(`尸体边上再看${target}时，你得把那点太熟练的判断压回笑里。`);
      else if (slotId === "4.4" && target) push(`投票前后，${target}哪怕只是停半秒，你都会先替他记下来。`);
      else if (motifs.has("care") && target) push(`你先拿玩笑垫一句，再看${target}会不会真把你当成好说话的人。`);
      else if (motifs.has("pressure") && target) push(`你不用抬高声音，也能逼${target}自己露出怯。`);
      else if (motifs.has("corpse") && target && slotId !== "5.1") push(`只要谈到死者，${target}就更容易发现你不像外行。`);
      else if (motifs.has("alliance") && target) push(`你和${target}若要同路，顶多也只是暂借一段退路。`);
      else if (motifs.has("concealment") && target) push(`只要${target}先把你放进“没威胁”那栏，你后面就还能继续动。`);
    }
    if (stage === "outcome") {
      if (slotId === "2.4") push("把判断带回人群后，风险也跟着翻了面。");
      else if (slotId === "3.3") push("尸体一出，后患就开始按秒记账。");
      else if (slotId === "4.4") push("这之后，你再开口就很难只算打圆场。");
      else if (slotId === "5.1") push("异变一来，你那套旧本事也跟着一起醒了。");
      else if (motifs.has("weapon")) push("只要手碰上工具，露底的风险就会跟着抬头。");
      else if (motifs.has("corpse")) push("一见尸体，旧本事就会先回魂。");
      else if (motifs.has("alliance")) push("别人一旦朝你靠近，你就更难继续装笨。");
      else if (motifs.has("concealment")) push("每一次示弱，后面都会回来记账。");
    }
    if (stage === "ripple") {
      if (slotId === "2.4") push("之后别人会更早回头找你。");
      else if (slotId === "4.4") push("投票之后，你很难再把自己摘出去。");
      else if (slotId === "5.1") push("警报之后，你再想装迟钝就晚了。");
      else if (slotId === "5.4") push("白门一开，总有东西会被你留在后面。");
      else if (motifs.has("corpse")) push("转角里会残留并不存在的现场味。");
      else if (motifs.has("alliance")) push("替谁兜过话，关系就会回来讨债。");
      else if (motifs.has("escape")) push("一认真找出口，你也已经在挑人。");
    }
    const limit = isHeavyInjury(draftState) ? 42 : 82;
    return lines.length ? ` ${compactRouteParagraph("debora", lines, limit)}` : "";
  }

  function buildFanModulePassage(slotId, stage, module, draftState, encounterId) {
    const motifs = new Set(module.motifs || []);
    const target = encounterId ? ENTITIES[encounterId]?.short || "" : "";
    const lines = [];
    if (stage === "opening") {
      if (motifs.has("prayer") && slotId !== "5.1") lines.push("你先低声念一句，免得自己先乱。");
      if (motifs.has("care") && !["5.1", "5.4"].includes(slotId)) lines.push("只要有人发抖，你就会先想把人稳住。");
      if (motifs.has("ritual")) lines.push("一碰到祭坛、圣物和旧规矩，你就会多看两眼。");
      if (motifs.has("corpse") && slotId !== "3.3") lines.push("一闻到死气，你就会先想这条命是怎么被交出去的。");
      if (motifs.has("sacrifice") && slotId !== "5.4") lines.push("只要局面逼人留下，你脑子里就会先响起那句“该有人扛”。");
    }
    if (stage === "encounter") {
      if (motifs.has("care") && target && slotId !== "5.1") lines.push(`你靠近${target}时，连自己都分不清是在安慰，还是在摸底。`);
      if (motifs.has("pressure") && target && slotId !== "2.4") lines.push(`${target}一提到罪、罚和报应，你就会盯得更紧。`);
      if (motifs.has("corpse") && target && slotId !== "3.3") lines.push(`死者一出现，${target}就更难把表情藏稳。`);
      if (motifs.has("vote") && target && slotId !== "4.4") lines.push(`你会先想，${target}最后会把名字写去哪里。`);
      if (motifs.has("prayer") && target && slotId !== "5.1") lines.push(`如果${target}也开始拿神意解释现实，你反而会先退半步。`);
    }
    if (stage === "outcome") {
      if (motifs.has("prayer")) lines.push("你知道自己已经不只是安慰了谁，而是替这一步背上了别的意义。");
      if (motifs.has("care") && slotId !== "5.1" && slotId !== "5.4") lines.push("只要有人因为你安静下来，你就会顺手把他的痛也背走一点。");
      if (motifs.has("ritual")) lines.push("和仪式沾边的收获，总会把你往更深处推。");
      if (motifs.has("sacrifice") && !["4.4", "5.4"].includes(slotId)) lines.push("一旦“该留下谁”被认真说出口，后面的选择都会被它缠住。");
    }
    if (stage === "ripple") {
      if (motifs.has("vote") && slotId !== "4.4") lines.push("从这里开始，很多对话都会提前长出票味。");
      if (motifs.has("corpse") && slotId !== "3.3") lines.push("死者的回声不会停在现场。");
      if (motifs.has("sacrifice") && !["5.1", "5.4"].includes(slotId)) lines.push("之后你再看门和同伴时，都会更容易把“谁留下”算进去。");
    }
    const stageLines = buildFanSlotStageLines(slotId, stage, draftState, encounterId).filter((line) => {
      if (stage === "encounter" && encounterId === "meruru" && line.includes("先把声音放轻")) return false;
      if (stage === "opening" && slotId === "5.1" && line.includes("派翠克觉醒后")) return false;
      return true;
    });
    lines.push(...stageLines);
    const limit = stage === "opening"
      ? slotId === "5.1" ? 68 : slotId === "5.4" ? 62 : 84
      : stage === "encounter"
        ? slotId === "5.1" ? 72 : slotId === "5.4" ? 70 : 90
        : stage === "outcome"
          ? 92
          : 88;
    return lines.length ? ` ${compactRouteParagraph("fan", lines, limit)}` : "";
  }

  function buildZicheModulePassage(slotId, stage, module, draftState, encounterId) {
    const motifs = new Set(module.motifs || []);
    const target = encounterId ? ENTITIES[encounterId]?.short || "" : "";
    const room = module.location?.name || "这里";
    const lines = [];
    if (stage === "opening") {
      if (motifs.has("surveillance")) lines.push(`你一进${room}，先确认哪一边能藏人，哪一边会把自己暴露出去。`);
      if (motifs.has("weapon")) lines.push("工具一露出来，你先掂重量和顺手程度。");
      if (motifs.has("generator") && !["1.1", "5.4"].includes(slotId)) lines.push("发电机摆在眼前时，你先想到的不是修不修，而是谁会来抢。");
      if (motifs.has("corpse") && slotId !== "3.3") lines.push("血迹一出现，你先盯落点和退路，别的情绪都往后压。");
      if (motifs.has("escape") && slotId !== "5.1") lines.push("一靠近出口，你就顺手把最坏那条路也补进脑子里。");
    }
    if (stage === "encounter") {
      if (motifs.has("pressure") && target) lines.push(`你和${target}对上时，先看谁会先露出急。`);
      if (motifs.has("alliance") && target) lines.push(`所谓结盟，在你眼里更像先借${target}一截路。`);
      if (motifs.has("corpse") && target && slotId !== "3.3") lines.push(`只要话题碰到现场，${target}一点迟疑都会被你放大。`);
      if (motifs.has("generator") && target && !["1.1", "5.4"].includes(slotId)) lines.push(`一扯到电闸和门闩，你先防${target}把节奏搅乱。`);
      if (motifs.has("escape") && target && slotId !== "5.1") lines.push(`一谈出口，你就顺手把${target}归进拖累还是助力。`);
    }
    if (stage === "outcome") {
      if (motifs.has("weapon")) lines.push("和工具有关的成果，会马上变成你手里的备用方案。");
      if (motifs.has("generator") && !["1.1", "5.1", "5.4"].includes(slotId)) lines.push("发电机一推进，后面的抢位顺序也得跟着改。");
      if (motifs.has("corpse") && slotId !== "3.3") lines.push("事情一沾死亡，你后面的判断只会更冷。");
      if (motifs.has("escape") && !["5.1", "5.4"].includes(slotId)) lines.push("出口一有变动，你脑子里的整张路线就得重画。");
    }
    if (stage === "ripple") {
      if (motifs.has("generator") && slotId !== "5.4") lines.push("这种推进不会只停在这一段。");
      if (motifs.has("corpse") && slotId !== "3.3") lines.push("之后每个拐角都更像潜在现场。");
      if (motifs.has("escape") && !["5.1", "5.4"].includes(slotId)) lines.push("出口一旦成了选项，之后所有合作都得重算。");
    }
    const stageLines = buildZicheSlotStageLines(slotId, stage, draftState, encounterId);
    if (stage === "opening" || stage === "encounter") {
      if (!lines.length) lines.push(...stageLines);
    } else if (stage === "outcome") {
      if (!lines.length) lines.push(...stageLines.slice(0, 1));
    } else {
      lines.push(...stageLines);
    }
    return lines.length ? ` ${compactRouteParagraph("ziche", lines, stage === "opening" ? 68 : stage === "encounter" ? 72 : 64)}` : "";
  }

  function buildModuleStageLine(roleId, module, draftState, stage, encounterId) {
    if (!module) return "";
    const hooks = new Set(module.proseHooks || []);
    const roomText = module.location?.code ? describeRoomLabel(module.location.code) : module.location?.name || "";
    const targetName = encounterId ? ENTITIES[encounterId]?.short || "" : "";
    const focusText = buildFocusEcho(roleId, module, roomText, targetName);
    const hookText = buildHookEcho(roleId, hooks, draftState, stage, targetName, roomText);
    const branchText = buildBranchEcho(roleId, module.branchClass, draftState, stage, targetName, roomText);
    const lines = [focusText, hookText, branchText].filter(Boolean);
    return lines.length ? ` ${lines.join(" ")}` : "";
  }

  function dedupeJoinedNarrative(text) {
    const normalized = normalizeNarrativeText(text);
    if (!normalized) return "";
    const pieces = normalized.split(/(?<=[。！？])/u).map((part) => part.trim()).filter(Boolean);
    const result = [];
    const seen = new Set();
    pieces.forEach((piece) => {
      const key = piece.replace(/\s+/g, "");
      const similarityKey = buildSentenceSimilarityKey(piece);
      if (seen.has(key) || (similarityKey && seen.has(similarityKey))) return;
      if ([...seen].some((prior) => key.includes(prior) || prior.includes(key) || (similarityKey && (similarityKey.includes(prior) || prior.includes(similarityKey))))) return;
      seen.add(key);
      if (similarityKey) seen.add(similarityKey);
      result.push(piece);
    });
    return result.join("");
  }

  function buildFocusEcho(roleId, module, roomText, targetName) {
    const focus = module.focus || "";
    const branchText =
      module.branchClass === "rest"
        ? "这是一个给自己留气口的时段。"
        : module.branchClass === "conflict"
          ? "这一步的核心不是到哪儿，而是把谁逼到边缘。"
          : module.branchClass === "verdict"
            ? "这一步会把前面的疑点重新折回人群中心。"
            : module.branchClass === "anchor"
              ? "这一步本身就会把主干事件往前推一格。"
              : "这一步会让局势出现新的面。";
    if (roleId === "fan") return `${branchText}${roomText ? ` ${roomText}会把试炼放得更近。` : ""}`;
    if (roleId === "ziche") return `${branchText}${roomText ? ` ${roomText}在你眼里就是可拆的地形。` : ""}`;
    if (roleId === "yamada") return `${branchText}${roomText ? ` ${roomText}会逼你换张更安全的脸。` : ""}`;
    if (roleId === "anjie") return `${branchText}${roomText ? ` ${roomText}足够让你继续校对假设。` : ""}`;
    if (roleId === "debora") return `${branchText}${roomText ? ` ${roomText}会让旧账先冒头。` : ""}`;
    return `${branchText}${roomText ? ` ${roomText}里有你能抓住的回声。` : ""}`;
  }

  function buildHookEcho(roleId, hooks, draftState, stage, targetName, roomText) {
    const lines = [];
    if (hooks.has("prose:rest") && stage === "opening") {
      lines.push(roleId === "patrick"
        ? "静下来以后，亡者的声音会先于活人的脚步找上你。"
        : roleId === "ziche"
          ? "你一停下来，就会开始听见别处的动静。"
          : roleId === "anjie"
            ? "休整不是停摆，只是把后续判断暂时压到更安静的地方。"
            : roleId === "debora"
              ? "你知道休息只会让某些记忆更有空隙钻出来。"
              : "你把呼吸放慢时，祷词和恐惧会一起浮上来。");
    }
    if (hooks.has("prose:encounter") && stage === "encounter") {
      lines.push(targetName
        ? `${targetName}会把这次碰面变成后面还要反复回看的节点。`
        : "这次正面碰面本身就会改变后面的对话方式。");
    }
    if (hooks.has("prose:scene") && stage === "opening") {
      lines.push(roleId === "anjie"
        ? "你会在这类地点先找证据，再找情绪。"
        : roleId === "ziche"
          ? "你会先找出这里能不能当成障碍物。"
          : "现场会先把细节交给你，再把答案交给后面的推理。");
    }
    if (hooks.has("prose:scene") && stage === "ripple") {
      lines.push(roleId === "debora"
        ? "现场残留的气味会把你拉回该记住的地方。"
        : "场景留下的细节会在后面再回头咬你一次。");
    }
    if (hooks.has("prose:conflict") && stage === "outcome") {
      lines.push(roleId === "ziche"
        ? "冲突只会继续抬高对方的警觉。"
        : "这类动作会把敌意从暗处推到明处。");
    }
    if (hooks.has("prose:verdict") && stage === "ripple") {
      lines.push(roleId === "anjie"
        ? "投票一旦落笔，后面的每一次见面都会带着旧票痕。"
        : "票纸会替之后的关系先写下裂痕。");
    }
    if (hooks.has("prose:karl")) {
      lines.push(roleId === "anjie"
        ? "卡尔的火气会让任何靠近他的人都多算一步。"
        : "卡尔这个名字会继续烧，直到有人把它压下去。");
    }
    if (hooks.has("prose:patrick")) {
      lines.push(roleId === "patrick"
        ? "你自己的名字也在悄悄变重。"
        : "派翠克的异样会越来越难再被当成普通恐慌。");
    }
    if (hooks.has("prose:meruru") && stage !== "opening") {
      lines.push(roleId === "fan"
        ? "梅露露这个名字会继续纠缠你对宽恕的理解。"
        : "梅露露的影子会把后面的沉默拉长。");
    }
    if (hooks.has("prose:meruru")) {
      lines.push(roleId === "patrick"
        ? "梅露露身上的光会被你记得很久。"
        : "梅露露的名字会在空气里拖得很长。");
    }
    if (roomText && stage === "ripple") {
      lines.push(roleId === "yamada"
        ? `${roomText}会成为你之后回想这一步时最先浮出的场景。`
        : `${roomText}会替这一步留下一枚不会立刻散掉的回声。`);
    }
    if (!lines.length) return "";
    return ` ${lines.join(" ")}`;
  }

  function buildBranchEcho(roleId, branchClass, draftState, stage, targetName, roomText) {
    const suspicion = draftState.suspicion?.player?.karl || 0;
    const alliances = Object.keys(draftState.alliances || {}).length;
    if (branchClass === "rest" && stage === "opening") {
      return roleId === "fan"
        ? "你把这当成一段短暂的赦免。"
        : "你知道这只是让后面更快到来的片刻停顿。";
    }
    if (branchClass === "discovery" && stage === "outcome") {
      return roleId === "anjie"
        ? "这类发现会直接补进你的笔记链。"
        : "你刚刚把一块拼图钉进了位置。";
    }
    if (branchClass === "encounter" && stage === "encounter") {
      return targetName
        ? `你和${targetName}之间的距离，已经比刚才更难装作没变化。`
        : "这次碰面会让关系表上的数值开始动。";
    }
    if (branchClass === "verdict" && stage === "ripple") {
      return `投票后的空气会比之前更硬。${alliances ? "而同盟也会因此更像临时借来的刀。" : ""}`;
    }
    if (branchClass === "anchor") {
      return stage === "opening"
        ? "主干事件就在前方等你把它推开。"
        : "这一步不会被轻易忘掉。";
    }
    if (suspicion > 20 && stage === "ripple") {
      return "卡尔的怀疑已经足够高，后面再碰面时只会更难装作无事。";
    }
    if (stage === "encounter" && targetName && roomText) {
      return `你和${targetName}在${roomText}里的这次交汇，会把后面要说的话都提前挤出一点锋口。`;
    }
    return "";
  }

  function buildRoleWordSentence(roleId, effects) {
    if (!effects.addWords.length) return "";
    if (roleId === "yamada") return `你记下密码词“${effects.addWords.join("、")}”。`;
    if (roleId === "debora") return `你记下密码词“${effects.addWords.join("、")}”。`;
    if (roleId === "fan") return `你记下密码词“${effects.addWords.join("、")}”。`;
    return roleId === "patrick"
      ? `密码词“${effects.addWords.join("、")}”先让你记住门。`
      : `你把新出现的密码词“${effects.addWords.join("、")}”记得很重，因为这类可重复验证的线索在当前局面里稀缺得近乎奢侈。`;
  }

  function buildRoleRelationSentence(roleId, encounterId, effects, draftState, slotId = "") {
    if (!encounterId || !effects.relations[encounterId]) return "";
    const delta = effects.relations[encounterId];
    const target = ENTITIES[encounterId].short;
    const prior = draftState.relations[encounterId] || 0;
    const stage = String(slotId || "")[0] || "1";
    if (roleId === "patrick") {
      return delta > 0
        ? `${target}对你软了一线。`
        : `${target}把距离收回了一寸。`;
    }
    if (roleId === "yamada") {
      return delta > 0
        ? `${target}对你松了一线。`
        : `${target}开始防你了。`;
    }
    if (delta > 0) {
      return prior >= 10
        ? stage === "4" || stage === "5"
          ? `${target}已经更愿意站近一点，后面很可能跟着改口。`
          : `${target}原本就不算远的态度，又向你靠近了一步。`
        : stage === "4" || stage === "5"
          ? `${target}先没再后退，这点松动到了表态时会更显眼。`
          : `${target}对你的戒心松了一线，这就够你继续往前试。`;
    }
    return stage === "4" || stage === "5"
      ? `${target}开始防你，后面表态时只会更难拉回。`
      : `${target}被你这一步推远了，下次再见只会更防。`;
  }

  function buildAnjieOpeningParagraph(slotId, location, visitCount, intent) {
    const base = getRoleSlotBase("anjie", slotId);
    const detail = getRoleActionDetail("anjie", intent);
    const visit = describeSceneVisit("anjie", location, visitCount);
    const action = detail?.opening || (intent.tags.includes("rest") ? "你先停下来，给过热的思路降温。" : "你先把目标拆开，再决定从哪一步下手。");
    const deduction = detail?.deduction || "只要还能列出步骤和核查顺序，你就还没彻底被恐惧追上。";
    const mental = intent.tags.includes("rest")
      ? "你先逼自己坐稳。可一安静下来，人物站位、时间顺序和证词冲突就会自己重排。"
      : "你没有把这一步当成冲动，而是当成必须立刻核验的程序。";
    return buildRouteCompactParagraph([visit, base, mental, action, deduction], 210);
  }

  function buildPatrickOpeningParagraph(slotId, location, visitCount, intent) {
    const base = getRoleSlotBase("patrick", slotId);
    const detail = getRoleActionDetail("patrick", intent);
    const visit = describeSceneVisit("patrick", location, visitCount);
    const action = detail?.opening || (intent.tags.includes("rest") ? "你停在原地，先把呼吸与心跳都压稳。" : "你先朝目标地点走去。");
    const deduction = detail?.deduction || "你先记方向，不急着下结论。";
    const mental = intent.tags.includes("rest")
      ? "你先放轻呼吸。"
      : "你把这一步当成一次追查。";
    return `${visit}${base}${mental}${action}${deduction}`;
  }

  function buildYamadaOpeningParagraph(slotId, location, visitCount, intent) {
    const base = getRoleSlotBase("yamada", slotId);
    const detail = getRoleActionDetail("yamada", intent);
    const visit = describeSceneVisit("yamada", location, visitCount);
    if (intent.tags.includes("rest")) {
      return compactRouteParagraph("yamada", [
        visit,
        base,
        "你先把呼吸、语气和视线压回安全线内。",
        `${location.name}越静，你越怕一点疲态都被人当成把柄。`,
        "你只是暂时停下，却还得让这一下看起来像无事发生。",
      ], 92);
    }
    if (slotId === "3.3") {
      return compactRouteParagraph("yamada", [
        `${visit}你刚踏到户外，就先把肩背绷住。`,
        "尸体摆在眼前时，你最怕的不是血，而是自己看得太熟。",
        "这时候任何冷静都像破绽，所以你只能先把表情压回去。",
      ], 96);
    }
    if (slotId === "4.4") {
      return compactRouteParagraph("yamada", [
        `${visit}票纸还没落下，你已经先感觉到所有视线都在找落点。`,
        "到了这一步，最危险的不是说错，而是让人看懂你准备投谁。",
        "你得连低头都控制得像偶然。",
      ], 96);
    }
    if (slotId === "5.1") {
      return compactRouteParagraph("yamada", [
        `${visit}警报一响，你那张最安全的脸先撑不住了。`,
        "你一靠近艾米莉，就更难把那点真正的焦急藏回去。",
        "到了最后一小时，连喘口气都像会被人拿去记账。",
      ], 98);
    }
    if (slotId === "5.4") {
      return compactRouteParagraph("yamada", [
        `${visit}白门就在前面，你却先被自己的偏心绊住。`,
        "越接近出口，你越清楚这一步会把你真正护着谁写得很明白。",
        "你已经没有余地再装成路过的人。",
      ], 98);
    }
    const action = detail?.opening || (intent.tags.includes("rest") ? "你靠墙站定，先把眼神和嗓音收回去。" : "你先看站位、出口和谁最急着解释自己。");
    const deduction = detail?.deduction || "先让人把你归进无害那格，再顺手拿走他们漏出的东西。";
    const mental = intent.tags.includes("rest")
      ? "你最怕的不是疲态，而是真脸先露出来。"
      : slotId === "3.3"
        ? "出了人命后，你反而更清楚自己不能露出熟练。"
        : slotId === "4.4"
          ? "到了投票前，最危险的不是说错，是让人看懂你准备投谁。"
          : slotId === "5.1" || slotId === "5.4"
            ? "最后这一小时里，你最怕的不是被看见害怕，而是被看见认真。"
            : "你不急着表态，只想先看清谁在拿什么遮自己的慌。";
    return compactRouteParagraph("yamada", [visit, base, mental, action, deduction], 92);
  }

  function buildDeboraOpeningParagraph(slotId, location, visitCount, intent) {
    const visit = describeSceneVisit("debora", location, visitCount);
    if (intent.tags.includes("rest")) {
      return compactRouteParagraph("debora", [
        visit,
        "你一停下，旧现场感就顺着脊背往回爬。",
        "现在最要紧的，不是喘匀，而是别让人看出你缓得太快。"
      ], 108);
    }
    if (slotId === "3.3") {
      return compactRouteParagraph("debora", [
        `${visit}你刚到案发区，先怕的不是尸体，而是自己看得太快。`,
        "哪里该看、哪里别碰、谁像动过现场，这些判断醒得太早，反而最容易害你露馅。",
        "你只能先把那份熟练压回一张更没用的脸后面。",
      ], 98);
    }
    if (slotId === "4.4") {
      return compactRouteParagraph("debora", [
        `${visit}票该投给谁还在后面，眼下最危险的是让人看出你已经开始排队形。`,
        "投票房越安静，你越得把那点熟练和偏向压回玩笑后面。",
        "这时候连低头都不能太像认真。",
      ], 98);
    }
    if (slotId === "5.1") {
      return compactRouteParagraph("debora", [
        `${visit}警报一响，你那层“没用的大人”外壳就开始往下掉。`,
        "你知道自己再演下去也没用了，真正会收残局的那个人已经快被逼出来。",
        "越靠近白门，你越难再靠玩笑把自己藏回去。",
      ], 98);
    }
    if (slotId === "5.4") {
      return compactRouteParagraph("debora", [
        `${visit}门就在前面，你最怕的已经不是怪物，而是自己终于得选边。`,
        "活着出去和留个体面样子，到了这一步往往不是同一件事。",
        "你已经没法再把自己放回那个只会打圆场的位置上。",
      ], 98);
    }
    const lines = {
      "1.1": [
        "刚醒时你先把呼吸放乱，像真的被这间牢房吓住了。",
        "会处理场面的人不能太稳，所以你宁可先把自己演成最没用的那个。"
      ],
      "2.4": [
        "第二次回到人群中央时，你比谁都清楚自己该少说一点。",
        "这时候最有价值的不是发言，而是谁先急着把自己解释干净。"
      ],
      "3.3": [
        "走到案发区时，你先怕的不是尸体，而是自己看得太快。",
        "哪里该看、哪里别碰、谁像动过现场，这些判断醒得太早，反而最容易害你露馅。"
      ],
      "4.4": [
        "票该投给谁还在后面，眼下最危险的是让人看出你已经开始排队形。",
        "投票房越安静，你越得把那点熟练和偏向都压回玩笑后面。"
      ],
      "5.1": [
        "警报一响，你那层“没用的大人”外壳就开始整片往下掉。",
        "你知道自己再演下去也没用了，真正会收残局的那个人已经快被逼出来。"
      ],
      "5.4": [
        "门就在前面，你最怕的已经不是怪物，而是自己终于得选边。",
        "活着出去和留个体面样子，到了这一步往往不是同一件事。"
      ]
    };
    return compactRouteParagraph("debora", [visit].concat(lines[slotId] || ["你先把熟练压住，只露出一点狼狈。"]), slotId === "4.4" ? 118 : 132);
  }

  function buildFanOpeningParagraph(slotId, location, visitCount, intent) {
    const detail = getRoleActionDetail("fan", intent);
    const visit = describeSceneVisit("fan", location, visitCount);
    const action = detail?.opening || (intent.tags.includes("rest") ? "你先把呼吸压稳。" : "你先提醒自己别急着把一切都解释成神意。");
    const mental = intent.tags.includes("rest")
      ? "你一停下来，疼和杂念就会一起冒头。"
      : "你知道自己太容易把异常看成启示，所以先逼自己慢半拍。";
    const slotLine =
      slotId === "1.1"
        ? "规则刚落下来，你先怀疑那份平静是不是演给你看的。"
      : slotId === "2.4"
        ? "这一次回到人群里，你得先决定替谁解释异常。"
      : slotId === "3.3"
          ? "梅露露一死，连天上的异象都像在逼你立刻表态。"
        : slotId === "4.4"
          ? "票纸摆上来时，你终于得把怀疑写成名字。"
          : slotId === "5.1"
              ? "警报一响，你就知道今天不会再留给任何人慢慢祈祷的时间。"
              : slotId === "5.4"
                ? "门就在前面，你却更先想到谁会被留在后面。"
                : "";
    if (slotId === "5.1") {
      return compactRouteParagraph("fan", [
        `${visit}警报一响，你先知道祷告来不及了。`,
        "你仍想把发抖的人稳住，却也明白这一次谁都不会被温柔等一等。",
        "派翠克一变样，你得同时决定是先抱住她，还是先把别人推开。",
      ], 126);
    }
    if (slotId === "5.4") {
      return compactRouteParagraph("fan", [
        `${visit}门已经在前面。`,
        "你一想到留下、挡住或把自己递出去，心里那套受难逻辑就先醒了。",
        "白门越近，你越清楚活下来的人也得把彼此欠下的东西一起带出去。",
      ], 126);
    }
    return compactRouteParagraph("fan", [visit, mental, action, slotLine], 108);
  }

  function buildZicheOpeningParagraph(slotId, location, visitCount, intent) {
    const base = getRoleSlotBase("ziche", slotId);
    const detail = getRoleActionDetail("ziche", intent);
    const visit = describeSceneVisit("ziche", location, visitCount);
    if (slotId === "1.1") {
      return compactRouteParagraph("ziche", [
        `${visit}你先摸门框，再看电子闸门的接缝。`,
        "这里不像临时关人的地方，更像故意留给你试错的笼子。",
        "你记下发电机的位置，也记下以后谁可能来抢这条线。",
      ], 96);
    }
    if (slotId === "3.3") {
      return compactRouteParagraph("ziche", [
        `${visit}户外地面湿滑，能藏人的掩体比活人说的话更值得看。`,
        "梅露露一死，这里就不再是互相试探的场子，而是真会出事的猎场。",
        "你先看血迹延到哪，再确认哪条退路还能走。",
      ], 98);
    }
    if (slotId === "4.4") {
      return compactRouteParagraph("ziche", [
        `${visit}石室里最有用的不是道理，是门、桌角和每个人离出口的距离。`,
        "票纸一摆出来，你就知道这次落笔会直接改掉后面的站位。",
      ], 98);
    }
    if (slotId === "5.1") {
      return compactRouteParagraph("ziche", [
        `${visit}警报一起，所有博弈都被改写成追猎。`,
        "你先把密道、拐角和最近的掩体串成一条线，免得下一秒只能靠本能乱跑。",
        "这里已经不讲道理，只讲谁先抢到活路。",
      ], 98);
    }
    if (slotId === "5.4") {
      return compactRouteParagraph("ziche", [
        `${visit}白门就在前面，可你先盯的是门框、闸口和派翠克可能扑过来的路线。`,
        "越到最后，越不是门本身麻烦，而是谁会在最后一步把节奏弄坏。",
      ], 96);
    }
    const action = detail?.opening || (intent.tags.includes("rest") ? "你没乱动，只把耳朵留给门外和墙后。" : "你弯下身摸过门框和墙角，确认哪里能借力，哪里会把人困死。");
    const deduction = detail?.deduction || "只要结构还讲得通，你就还有办法把命从这里抢出去。";
    const mental = intent.tags.includes("rest")
      ? "休息对你来说，只是暂时停手。"
      : slotId === "5.1"
        ? "警报一响，你先把活路排在所有解释前面。"
        : slotId === "5.4"
          ? "门就在前面，你反而更防最后一刻有人失手。"
          : "你先把房间当地形，再决定谁值得靠近。";
    const slotClose =
      slotId === "5.1"
        ? "到了这里，慢半拍都可能直接丢命。"
        : slotId === "5.4"
          ? "白门越近，最难算的反而越不是门。"
          : "";
    return compactRouteParagraph("ziche", [visit, base, mental, action, deduction, slotClose], slotId === "5.1" || slotId === "5.4" ? 104 : 96);
  }

  function buildAnjieEncounterParagraph(slotId, encounterId, location, intent, draftState) {
    const target = ENTITIES[encounterId]?.short || "对方";
    const positive = intent.tags.includes("social") || intent.tags.includes("protect");
    const aggressive = intent.tags.includes("attack");
    const relation = draftState.relations[encounterId] || 0;
    const read =
      encounterId === "patrick"
        ? "派翠克太平静了，平静得像把异常捧在手里。"
        : encounterId === "karl"
          ? "卡尔的问题不只在音量，而是他总把情绪说成秩序。"
          : encounterId === "meruru"
            ? "梅露露知道得太多，也始终没把话说全。"
            : encounterId === "emily"
              ? "艾米莉的害怕很真，也因此更要和线索分开看。"
              : `${target}站在那里，像一份还没拆开的证词。`;
    const reaction = aggressive
      ? `${target}比语言更快地绷紧了，像已经把你记进下一轮危险名单。`
      : positive
        ? `${target}因为你的措辞稍微松了一线，已经够你继续试探。`
        : `${target}没有立刻亮态度，这种停顿本身就是信息。`;
    const trust = relation >= 14
      ? `你已经摸到和${target}对话的节奏，知道该追问还是该让一步。`
      : `你不敢把这次相遇浪费在寒暄上。下一次，局势未必还给你这么完整的观察距离。`;
    return buildRouteCompactParagraph([`你在${location.name}和${target}对上时，先排出的不是客套，而是提问顺序。`, read, reaction, trust], 220);
  }

  function buildPatrickEncounterParagraph(slotId, encounterId, location, intent, draftState) {
    const target = ENTITIES[encounterId]?.short || "对方";
    const positive = intent.tags.includes("social") || intent.tags.includes("protect");
    const aggressive = intent.tags.includes("attack");
    const relation = draftState.relations[encounterId] || 0;
    const read =
      encounterId === "anjie"
        ? "安洁的魂火一直在抖。"
        : encounterId === "karl"
          ? "卡尔胸口那团火烧得太旺了。"
          : encounterId === "meruru"
            ? "梅露露身上的气息像两层影子叠在一起。"
            : encounterId === "emily"
              ? "艾米莉的光太薄了。"
              : `${target}身上的光有点乱。`;
    const reaction = aggressive
      ? `${target}马上察觉到你盯得太深，呼吸短了一拍。`
      : positive
        ? `${target}先迟疑了一下，还是停在了你面前。`
        : `${target}一时分不清你的安静是礼貌还是审视。`;
    const trust = relation >= 14
      ? "你知道这次沉默也算表态。"
      : "你不想把这次碰面浪费在寒暄上。";
    return `你在${location.name}遇见${target}时，先感到的不是表情，而是对方此刻气息的冷热。${read}${reaction}${trust}`;
  }

  function buildYamadaEncounterParagraph(slotId, encounterId, location, intent, draftState) {
    const target = ENTITIES[encounterId]?.short || "对方";
    if (slotId === "3.3" && encounterId === "emily") {
      return compactRouteParagraph("yamada", [
        `你在${location.name}碰见${target}时，先把声音压到只够她听见。`,
        "死者一出现，你最怕的不是她崩溃，而是她看出你处理这种场面太熟。",
        "你得一边拉住她，一边把自己那点本能反应压回去。",
      ], 98);
    }
    if (slotId === "4.4" && encounterId === "karl") {
      return compactRouteParagraph("yamada", [
        `你在${location.name}碰见${target}时，没让眼神停太久。`,
        "投票前后，他只要再抬高一点声音，旁人的视线就会被一起带偏。",
        "你得先防他把矛头拽到你身上。",
      ], 96);
    }
    if (slotId === "5.1" && encounterId === "emily") {
      return compactRouteParagraph("yamada", [
        `你在${location.name}碰见${target}时，本能地把话说轻。`,
        "她越慌，你越怕自己那点真心先漏出来。",
        "异变后的她像一面镜子，逼你看见自己到底有多着急。",
      ], 96);
    }
    if (slotId === "5.4" && encounterId === "emily") {
      return compactRouteParagraph("yamada", [
        `你在${location.name}碰见${target}时，先把她往门的方向推。`,
        "到了门前，能留住的早就不是体面，只剩你肯不肯先认账。",
        "艾米莉眼底那一下收紧，比任何回答都更像告别。",
      ], 96);
    }
    const positive = intent.tags.includes("social") || intent.tags.includes("protect");
    const aggressive = intent.tags.includes("attack");
    const relation = draftState.relations[encounterId] || 0;
    const read =
      encounterId === "emily"
        ? "你最怕她信你，也怕她不信。"
        : encounterId === "karl"
          ? "卡尔最恨别人示弱时还在记他的失控。"
          : encounterId === "patrick"
            ? "派翠克太静，静得像会反过来看你。"
            : `${target}像在等你先交一版自己。`;
    const reaction = aggressive
      ? `${target}眼底那一下收紧，比反驳更值得记。`
      : positive
        ? `你那点柔软口气，让${target}慢了一拍。`
        : slotId === "4.4"
          ? `${target}还在猜你这一票究竟会写谁。`
          : `${target}还没摸清你到底是来帮忙，还是来记账。`;
    const trust = relation >= 14
      ? "你们已经不是初见，这次失手会更疼。"
      : slotId === "5.4"
        ? "到了门前，能留住的已经不是体面，只剩余地。"
        : "先留住余地就够了。";
    return compactRouteParagraph("yamada", [`你在${location.name}碰见${target}时，先把语速压低。`, read, reaction, trust], 88);
  }

  function buildDeboraEncounterParagraph(slotId, encounterId, location, intent, draftState) {
    const target = ENTITIES[encounterId]?.short || "对方";
    if (slotId === "3.3" && encounterId === "karl") {
      return compactRouteParagraph("debora", [
        `你在${location.name}碰见${target}时，先把口气放软。`,
        "尸体边上再看他，你最怕的不是被吼，而是自己先把判断写在眼睛里。",
        "你得把那点太熟练的反应压回笑里，免得他先看出你不对。",
      ], 98);
    }
    if (slotId === "4.4" && encounterId === "karl") {
      return compactRouteParagraph("debora", [
        `你在${location.name}碰见${target}时，先把陪笑挂稳。`,
        "这时候每句话都会被人记成站位，连玩笑都像在替谁垫票。",
        "卡尔哪怕只是停半秒，你都会先替他记下来。",
      ], 98);
    }
    if (slotId === "5.1" && encounterId === "meruru") {
      return compactRouteParagraph("debora", [
        `你在${location.name}碰见${target}时，先把声音放得像平时一样软。`,
        "可一谈死者，你就更难装成外行。",
        "真会看现场的人，到这种时候是藏不住的。",
      ], 96);
    }
    if (slotId === "5.4" && encounterId === "patrick") {
      return compactRouteParagraph("debora", [
        `你在${location.name}碰见${target}时，先把语气放缓。`,
        "到了白门前，和她说的每句话都像在提前分配谁先走、谁留下。",
        "你最怕的不是被识破，而是终于没法再装没关系。",
      ], 98);
    }
    const positive = intent.tags.includes("social") || intent.tags.includes("protect");
    const aggressive = intent.tags.includes("attack");
    const relation = draftState.relations[encounterId] || 0;
    const read =
      encounterId === "karl"
        ? "卡尔越高声，你越知道他快失手。"
        : encounterId === "ziche"
          ? "子车一旦认准你没用，反而最好观察。"
          : encounterId === "anjie"
            ? "安洁的紧绷提醒你别装得太真。"
            : `${target}在试探你到底是真的慌，还是故意装慌。`;
    const reaction = aggressive
      ? "你差点露底，好在及时收住。"
      : positive
        ? `${target}先把你归进“无害的大人”。`
        : `${target}还没想好要不要继续低估你。`;
    const trust = relation >= 14
      ? `${target}只要再靠近一步，你就难继续装。`
      : "你只求先让对方忘了防你。";
    const extra = slotId === "4.4"
      ? "这时候每句话都会被人记成站位，连陪笑都像在替谁垫票。"
      : slotId === "5.1"
        ? "一谈死者，你就更难装成外行。真会看现场的人，到这种时候是藏不住的。"
      : slotId === "5.4"
        ? `到了白门前，和${target}说的每句话都像在提前分配谁先走、谁留下。`
        : "";
    return compactRouteParagraph("debora", [
      `你在${location.name}碰见${target}时，先把口气放软。`,
      read,
      reaction,
      trust,
      extra,
    ], slotId === "4.4" ? 108 : slotId.startsWith("5.") ? 124 : 118);
  }

  function buildFanEncounterParagraph(slotId, encounterId, location, intent, draftState) {
    const target = ENTITIES[encounterId]?.short || "对方";
    const positive = intent.tags.includes("social") || intent.tags.includes("protect");
    const aggressive = intent.tags.includes("attack");
    const relation = draftState.relations[encounterId] || 0;
    const read =
      encounterId === "karl"
        ? "卡尔胸口那团火，已经快把正义烧成了借口。"
        : encounterId === "meruru"
          ? "梅露露太像会被献上的那一个。"
          : encounterId === "patrick"
            ? "派翠克的平静总让你分不清那是安息还是坠落。"
            : `${target}看上去像还没决定要把恐惧交给谁。`;
    const reaction = aggressive
      ? `${target}一下绷紧，像已经看出你的温柔里也有逼问。`
      : positive
        ? `${target}因为你放轻的语气，短暂松了一寸。`
        : `${target}没立刻接话，只先看你想把他往哪边带。`;
    const trust = relation >= 14
      ? `你已经知道，${target}哪类伤口最碰不得。`
      : "你不急着把话说满，因为真正留痕的往往不是道理。";
    if (slotId === "5.1") {
      return compactRouteParagraph("fan", [
        `你在${location.name}碰见${target}时，先把声音压低。`,
        read,
        reaction,
        "你不敢把这一步只当成安慰，因为此刻每一次靠近都像在替结局表态。",
      ], 118);
    }
    if (slotId === "5.4") {
      return compactRouteParagraph("fan", [
        `你在${location.name}拦住${target}时，没有先喊。`,
        `${target}一下绷紧，像看懂了你是来挡路的。`,
        "你知道真正会留下痕的，不是大声，而是你肯不肯先站上去。",
      ], 88);
    }
    if (slotId === "1.1" && encounterId === "meruru") {
      return compactRouteParagraph("fan", [
        `你在${location.name}见到${target}时，先收住语气。`,
        read,
        reaction,
        trust,
      ], 108);
    }
    return compactRouteParagraph("fan", [`你在${location.name}见到${target}时，先把声音放轻。`, read, reaction, trust], 116);
  }

  function buildZicheEncounterParagraph(slotId, encounterId, location, intent, draftState) {
    const target = ENTITIES[encounterId]?.short || "对方";
    if (slotId === "1.1" && encounterId === "meruru") {
      return compactRouteParagraph("ziche", [
        `你在${location.name}看见${target}，没有往前靠。`,
        "她说话太轻，轻得像故意把人往规则里领。",
        "你先记住她离门有多近，再决定要不要回应。",
      ], 92);
    }
    if (slotId === "3.3" && encounterId === "karl") {
      return compactRouteParagraph("ziche", [
        `你在${location.name}撞见${target}时，先留出能后撤的距离。`,
        "梅露露死后，他每次呼吸都像快把火点到别人身上。",
        "你不急着跟他争，只先看他会不会先失控。",
      ], 96);
    }
    if (slotId === "4.4" && encounterId === "karl") {
      return compactRouteParagraph("ziche", [
        `你在${location.name}撞见${target}时，没有把眼神久留。`,
        "投票前后，任何一次对视都可能被当成站队。",
        "你先防的不是他动手，而是他突然抬高声音，把所有视线一起拖过来。",
      ], 98);
    }
    if (slotId === "5.1" && encounterId === "patrick") {
      return compactRouteParagraph("ziche", [
        `你在${location.name}碰见${target}时，先绕开她正前方。`,
        "她越安静，你越不信这份安静会一直站在你这边。",
        "要不要把她算进同一路里，你得在几秒内做完。",
      ], 96);
    }
    if (slotId === "5.4" && encounterId === "patrick") {
      return compactRouteParagraph("ziche", [
        `你在${location.name}拦住${target}时，先逼她停在门前那一步。`,
        "到了这里，解释已经没用了。",
        "你只想知道她会不会在白门开启前，把最后一点节奏全打乱。",
      ], 94);
    }
    const positive = intent.tags.includes("social") || intent.tags.includes("protect");
    const aggressive = intent.tags.includes("attack");
    const relation = draftState.relations[encounterId] || 0;
    const read =
      encounterId === "karl"
        ? "卡尔最危险的不是力气，是他会把失控说成规矩。"
      : encounterId === "patrick"
        ? "派翠克越安静，你越不想把背后交给她。"
      : encounterId === "emily"
        ? "艾米莉一慌，周围就更容易一起乱。"
        : `${target}站在那里时，你先想的不是寒暄，而是他会不会挡你的路。`;
    const reaction = aggressive
      ? `${target}本能后撤半步，你顺势把空出来的距离吃死。`
      : positive
        ? `${target}没料到你会先松一点口气，警惕只慢了一瞬。`
        : `${target}还在试着摸你的底线，可你没有给出能让人放心的答案。`;
    const trust = relation >= 14
      ? `你们之间已经有前账，所以这次碰面更像重新划线。`
      : slotId === "5.4"
        ? "到了门前，任何一句多余的话都可能拖慢最后那一步。"
        : `你不想白费这次接触，下回再见，多半只会更难说话。`;
    const opener = slotId === "5.4"
      ? `你在${location.name}拦住${target}，先把他逼停在门前那一步。`
      : `你在${location.name}撞见${target}，先把自己留在一伸手够不到的地方。`;
    return compactRouteParagraph("ziche", [opener, read, reaction, trust], slotId === "5.4" ? 102 : 96);
  }

  function buildAnjieOutcomeParagraph(slotId, encounterId, effects, intent, draftState) {
    const finding = buildRoleFindingSentence("anjie", effects, slotId);
    const word = buildRoleWordSentence("anjie", effects);
    const relation = buildRoleRelationSentence("anjie", encounterId, effects, draftState, slotId);
    const strain = slotId === "5.1"
      ? "最难受的不是惊吓，而是逻辑在超自然面前直接断线。你还想重排它，却已经没有足够完整的工具。"
      : effects.stats.san < 0
        ? "代价很明确。理智让了位，那股熟悉的焦躁又顺着脊背往上爬。"
        : effects.stats.mp < 0
          ? "为了维持判断和推进速度，你又提前透支了精力。身体的虚弱没走，只是被你压到后面。"
          : "你把新信息并进原有链条，同时删掉几条站不住脚的旧假设。逻辑还没闭合，但至少没有塌。";
    return buildRouteCompactParagraph([finding, word, relation, strain, "你立刻知道，这段结果会改写后面的判断顺序。"], 200);
  }

  function buildPatrickOutcomeParagraph(slotId, encounterId, effects, intent, draftState) {
    const finding = buildRoleFindingSentence("patrick", effects, slotId);
    const word = buildRoleWordSentence("patrick", effects);
    const relation = buildRoleRelationSentence("patrick", encounterId, effects, draftState, slotId);
    const strain = slotId === "5.1"
      ? "到了这一步，你快分不清自己和那股饥饿，但你还记得怎么克制。"
      : effects.stats.san < 0
        ? "代价很清楚。那阵回声顺手带走了一点平静。"
        : effects.stats.mp < 0
          ? "你把心力借给了不属于此世的声音，脚下发虚。"
          : "你先把这份结果收住。";
    return `${finding}${word}${relation}${strain}`;
  }

  function buildYamadaOutcomeParagraph(slotId, encounterId, effects, intent, draftState) {
    const finding = buildRoleFindingSentence("yamada", effects, slotId);
    const word = buildRoleWordSentence("yamada", effects);
    const relation = buildRoleRelationSentence("yamada", encounterId, effects, draftState, slotId);
    if (slotId === "3.3") {
      return compactRouteParagraph("yamada", [
        finding,
        word,
        relation,
        "尸体一摆出来，你以前见过的那些脏东西也跟着回头了。",
        "这下你再装外行，只会显得更可疑。",
      ], 98);
    }
    if (slotId === "4.4") {
      return compactRouteParagraph("yamada", [
        finding,
        word,
        relation,
        "票纸一折，你之前留给自己的回旋立刻像证词。",
        "票一公开，刚才那些含糊其辞都得重新算账。",
      ], 98);
    }
    if (slotId === "5.1") {
      return compactRouteParagraph("yamada", [
        finding,
        word,
        relation,
        "最糟的是，警报一响，你已经没时间再用圆话换缓冲了。",
        "到了这一步，你更怕自己下一秒会心软，而不是会心狠。",
      ], 98);
    }
    if (slotId === "5.4") {
      return compactRouteParagraph("yamada", [
        finding,
        word,
        relation,
        "越到门前，你越清楚偏心和自保都得当场付账。",
        "谁被你护住，谁就会成为你带出去的那笔账。",
      ], 96);
    }
    const strain = slotId === "5.1"
      ? "最糟的是，警报一响，你已经没时间再用圆话换缓冲了。"
      : slotId === "5.4"
        ? "越到门前，你越清楚偏心和自保都得当场付账。"
        : slotId === "4.4"
          ? "票纸一折，你之前留给自己的回旋立刻像证词。"
      : effects.stats.san < 0
        ? "你还能维持表情，可脑子里的线已经绷到发疼。"
        : effects.stats.mp < 0
          ? "你把力气花在姿态和判断上，疲态终于从声音里漏出来。"
          : slotId === "3.3"
            ? "你没拿到定论，但先记牢了谁在看尸体时反应太快。"
            : "你先把刚才露出的眼神、停顿和漏洞记下来。";
    const extraTail = slotId === "5.4" ? "" : buildOutcomeTail("yamada", slotId);
    return compactRouteParagraph("yamada", [finding, word, relation, strain, extraTail], slotId === "5.1" ? 80 : 88);
  }

  function buildDeboraOutcomeParagraph(slotId, encounterId, effects, intent, draftState) {
    const finding = buildRoleFindingSentence("debora", effects, slotId);
    const word = buildRoleWordSentence("debora", effects);
    const relation = buildRoleRelationSentence("debora", encounterId, effects, draftState, slotId);
    if (slotId === "3.3") {
      return compactRouteParagraph("debora", [
        finding,
        word,
        relation,
        "旧现场感一回头，装糊涂就更费劲了。",
        "你明明只想继续演个没什么用的大人，眼睛却已经替你把现场先收了一遍。",
      ], 100);
    }
    if (slotId === "4.4") {
      return compactRouteParagraph("debora", [
        finding,
        word,
        relation,
        "票一落下，你就得跟着一起算账。",
        "之前那些故意模糊的表情和停顿，都会在这一刻被人倒着解读。",
      ], 100);
    }
    if (slotId === "5.1") {
      return compactRouteParagraph("debora", [
        finding,
        word,
        relation,
        "到了这一步，你再也藏不住那个会收残局的人。",
        "混乱一来，你比别人更快知道该先看尸体、看出口，还是看谁马上会失控。",
      ], 100);
    }
    if (slotId === "5.4") {
      return compactRouteParagraph("debora", [
        finding,
        word,
        relation,
        "白门近了以后，你知道最后留下来的不是漂亮话，而是谁替谁把脏事接走。",
        "到了最后，连侥幸都得一并吞回去。",
      ], 96);
    }
    const strain = slotId === "5.1"
      ? "到了这一步，你再也藏不住那个会收残局的人。混乱一来，你比别人更快知道该先看尸体、看出口，还是看谁马上会失控。"
      : slotId === "5.4"
        ? "白门近了以后，你知道最后留下来的不是漂亮话，而是谁替谁把脏事接走。"
      : slotId === "4.4"
        ? "票一落下，你就得跟着一起算账。之前那些故意模糊的表情和停顿，都会在这一刻被人倒着解读。"
      : slotId === "3.3"
        ? "旧现场感一回头，装糊涂就更费劲。你明明只想继续演个没什么用的大人，眼睛却已经替你把现场先收了一遍。"
      : effects.stats.san < 0
        ? "旧现场感又贴回来了，连呼吸都像沾着停尸房的凉气。"
      : effects.stats.mp < 0
        ? "你先拿冷静硬顶了一段。嘴上还能陪笑，肩背却已经先紧起来了。"
        : "你嘴上还在圆场，身体却先把风险记住了。你知道这种事不会当场结束，后面总会回来找你。";
    return compactRouteParagraph("debora", [finding, word, relation, strain, buildOutcomeTail("debora", slotId)], slotId === "4.4" ? 108 : 124);
  }

  function buildFanOutcomeParagraph(slotId, encounterId, effects, intent, draftState) {
    const finding = buildRoleFindingSentence("fan", effects, slotId);
    const word = buildRoleWordSentence("fan", effects);
    const relation = buildRoleRelationSentence("fan", encounterId, effects, draftState, slotId);
    const strain = slotId === "5.1"
      ? "最难受的不是异变本身，而是你第一反应仍然是去抱住它。你知道自己已经不只是安慰了谁，而是替这一步背上了别的意义。"
      : slotId === "5.4"
        ? "你连祷词都像在替最后要留下的人点名。越靠近白门，你越知道门外也不会替谁把账抹平。"
      : slotId === "4.4"
        ? "票一落下，你连“宽恕”这两个字都不敢再说得太轻。投票落下后，你知道审判写下的是谁来承担后果。"
      : slotId === "3.3"
        ? "死讯一来，连你最熟的祷词都像卡在喉咙里。梅露露的死，把大家不肯先说的话逼成了事实。"
      : slotId === "2.4"
        ? "你越想替所有人解释，偏执就越先抬头。"
      : effects.stats.san < 0
        ? "祷词还在，可偏执也更清楚了。"
      : effects.stats.mp < 0
          ? "你把心力借给安抚和祷词，回神时已发虚。"
          : "你已经没法只把这事当安慰。";
    return compactRouteParagraph("fan", [finding, word, relation, strain], 82);
  }

  function buildZicheOutcomeParagraph(slotId, encounterId, effects, intent, draftState) {
    const finding = buildRoleFindingSentence("ziche", effects, slotId);
    const word = buildRoleWordSentence("ziche", effects);
    const relation = buildRoleRelationSentence("ziche", encounterId, effects, draftState, slotId);
    if (slotId === "3.3") {
      return compactRouteParagraph("ziche", [
        finding,
        word,
        relation,
        "尸体一出现，后面的每一步都得按秒算；谁慢，谁就会先被留在外面。",
        "你的判断更冷了，也更难回头。",
      ], 100);
    }
    if (slotId === "5.1") {
      return compactRouteParagraph("ziche", [
        finding,
        word,
        relation,
        "异变一来，分辨善恶已经来不及，先跑出去才是正事。",
        "派翠克一变，你那套按常规处理人的办法也跟着废了。",
      ], 100);
    }
    if (slotId === "5.4") {
      return compactRouteParagraph("ziche", [
        finding,
        word,
        relation,
        "到了门前，你只能赌谁先动，谁还能在白光压下来前撑住。",
        "白门给不给路，很多时候只差最后那半步。",
      ], 98);
    }
    const strain = slotId === "5.1"
      ? "异变一来，场面立刻失控。你来不及再分辨谁值不值得救，只能先把最近那条活路按进脑子里。"
      : slotId === "5.4"
        ? "到了门前，已经没有稳妥答案。你只能赌谁先动，谁还能在白光压下来前撑住。"
      : slotId === "4.4"
        ? "票一落下，站位就定了一半。之后谁会帮你，谁会顺手把你丢下，已经开始有了方向。"
      : slotId === "3.3"
        ? "尸体和乱局一摆上来，你就知道后面的每一步都得按秒算，谁慢，谁就会先被留在外面。"
      : effects.stats.san < 0
        ? "你把惊悸硬压回去，只留下还能执行的那部分。剩下那些发冷和发麻的反应，得等活下来再处理。"
        : effects.stats.mp < 0
          ? "你拿体力和专注换来一点先手，代价是后面更难回稳。可这点先手，往往就够决定谁先碰到出口。"
          : "这点收获刚到手，就被你立刻塞进后面的新路线里，连犹豫都没留。";
    return compactRouteParagraph("ziche", [finding, word, relation, strain, buildOutcomeTail("ziche", slotId)], slotId === "5.1" || slotId === "5.4" ? 112 : 104);
  }

  function buildAnjieRippleParagraph(slotId, encounterId, effects, intent) {
    const stake = intent.tags.includes("rest") ? SLOT_STAKES[slotId]?.rest : SLOT_STAKES[slotId]?.after;
    const exposure = effects.stats.san < 0 || effects.stats.hp < 0
      ? "更麻烦的是，你在别人眼里的轮廓也更清楚了。以后再想躲回“体弱又无害”的印象后面，会越来越难。"
      : "这次动作表面上没掀起大波澜，可真正要命的，往往正是这种没被点破的变化。";
    const bond = effects.flags.patrickBond
      ? "你和派翠克之间那条原本还算克制的线被真正系紧。到了终局，它可能替你挡下一次追猎，也可能逼你面对更疼的告别。"
      : effects.flags.karlExposed
        ? "卡尔不会忘记你在他叙事里打下的缺口。下次再争执，他更可能先把你当成障碍。"
        : effects.flags.emilyProtected
          ? "艾米莉已经开始把你视作可以追着跑的人。那份依赖之后是助力还是拖累，要看你还有没有余裕继续接住。"
          : "";
    return buildRouteCompactParagraph([stake || "你很清楚，这不是会被当场结算完的小选择。", exposure, bond, "你得准备在后面某个时段替它付账。"], 200);
  }

  function buildPatrickRippleParagraph(slotId, encounterId, effects, intent) {
    const stake = intent.tags.includes("rest") ? SLOT_STAKES[slotId]?.rest : SLOT_STAKES[slotId]?.after;
    const exposure = effects.stats.san < 0 || effects.stats.hp < 0
      ? "你在众人命运里的位置被推前了。"
      : "命运线已经偏了一点。";
    const bond = effects.flags.patrickBond
      ? "你伸出去的那只手被认真接住过，所以以后放手会更疼。"
      : effects.flags.emilyProtected
        ? "艾米莉的魂火往你这边偏了一寸。"
        : effects.flags.karlExposed
          ? "卡尔已经把你的名字记进去了。"
          : "";
    return `${stake || "你知道这段回响不会立刻结束。"}${exposure}${bond}`;
  }

  function buildYamadaRippleParagraph(slotId, encounterId, effects, intent) {
    const stake = intent.tags.includes("rest") ? SLOT_STAKES[slotId]?.rest : SLOT_STAKES[slotId]?.after;
    const exposure = effects.stats.san < 0 || effects.stats.hp < 0
      ? "你还没露底，但别人已经比十五分钟前更会盯你。"
      : "这一步不大，却已经把后面再见时的气氛先改掉了。";
    const bond = effects.flags.emilyProtected
      ? "艾米莉之后会更本能地往你这边靠。"
      : effects.flags.karlExposed
        ? "卡尔不会忘记，是你看见了他最难看的那一下。"
      : effects.flags.patrickBond
          ? "你和派翠克之间那条线，之后谁也别想装没发生过。"
          : "";
    return compactRouteParagraph("yamada", [stake || "你知道自己已经改动了一小截时间线。", exposure, bond], 72);
  }

  function buildDeboraRippleParagraph(slotId, encounterId, effects, intent) {
    const stake = intent.tags.includes("rest") ? SLOT_STAKES[slotId]?.rest : SLOT_STAKES[slotId]?.after;
    if (slotId === "3.3") {
      return compactRouteParagraph("debora", [
        stake || "小判断最会拖成长账。",
        "你那层壳又薄了一点，接下来再想装成只会打圆场的大人，别人已经没那么容易信了。",
        "卡尔会记得，是谁看见过他最难看的样子。",
      ], 98);
    }
    if (slotId === "4.4") {
      return compactRouteParagraph("debora", [
        stake || "小判断最会拖成长账。",
        "投票之后，你很难再把自己摘出去。",
        "之后连沉默都会被人算进站位。",
      ], 96);
    }
    if (slotId === "5.1") {
      return compactRouteParagraph("debora", [
        stake || "你知道后果不会就地收干净。",
        "警报之后，你再想装迟钝就晚了。",
        "到白门前，你得更早收手。",
      ], 96);
    }
    const exposure = effects.stats.san < 0 || effects.stats.hp < 0
      ? "你那层壳又薄了一点。接下来再想装成只会打圆场的大人，别人已经没那么容易信了。"
      : "现在没爆开的东西，后面最容易翻倍找回来。你很清楚这种小动作最会拖成长账。";
    const bond = effects.flags.emilyProtected
      ? "被你接住的人，后面会更习惯往你这边靠。依赖一旦长出来，就不会只在好时候才找上门。"
      : effects.flags.karlExposed
        ? "卡尔会记得，是谁看见过他最难看的样子。下次再失手时，他也更可能先冲你来。"
        : effects.flags.patrickBond
          ? "你和派翠克之间那点纠葛，也被这一步拧紧了。之后再想把话说轻，都会显得太晚。"
          : "";
    const end = slotId === "4.4"
      ? "之后连沉默都会被人算进站位。"
      : slotId === "5.1"
        ? "到白门前，你得更早收手。"
      : slotId === "5.4"
        ? "白门一开，总有东西会被你留在后面。"
        : "后面你得盯得更紧。";
    return compactRouteParagraph("debora", [stake || "小判断最会拖成长账。", exposure, bond, end], slotId === "4.4" ? 108 : 122);
  }

  function buildFanRippleParagraph(slotId, encounterId, effects, intent) {
    const stake = intent.tags.includes("rest") ? SLOT_STAKES[slotId]?.rest : SLOT_STAKES[slotId]?.after;
    const exposure = effects.stats.san < 0 || effects.stats.hp < 0
      ? slotId.startsWith("5.")
        ? "之后别人会更难把你的温柔当成无害。"
        : slotId.startsWith("4.")
          ? "你的靠近会更容易被人读成立场。"
          : slotId === "3.3"
            ? "死讯之后，别人会更快把你记成那个总想替人扛的人。"
            : "别人会更早记住你那种过头的温柔。"
      : "这一步没有当场结算，后面却会更响。";
    const bond = effects.flags.patrickBond
      ? "你伸向派翠克的那只手，之后一定会回来讨账。"
      : effects.flags.emilyProtected
        ? "艾米莉那边的恐惧也更容易往你这边靠。"
        : effects.flags.karlExposed
          ? "卡尔不会忘记你曾站到他的火前。"
          : "";
    const end = slotId === "5.4"
      ? "门开以后，你也很难再把那次主动挡上去的决定说成一时冲动。"
      : slotId === "5.1"
        ? "觉醒之后，你很难再用祈祷把自己按回原位。"
        : "";
    return compactRouteParagraph("fan", [stake || "你知道后果不会只是偶然。", exposure, bond, end], 92);
  }

  function buildZicheRippleParagraph(slotId, encounterId, effects, intent) {
    const stake = intent.tags.includes("rest") ? SLOT_STAKES[slotId]?.rest : SLOT_STAKES[slotId]?.after;
    const exposure = effects.stats.san < 0 || effects.stats.hp < 0
      ? "你那副只认活路的样子，已经被更多人看清。"
      : "这一步看着不大，却已经改了后面几条路的先后。";
    const bond = effects.flags.emilyProtected
      ? "艾米莉之后更可能直接追着你跑。"
      : effects.flags.karlExposed
        ? "卡尔更可能先把你当障碍。"
        : effects.flags.patrickBond
          ? "你和派翠克之间的距离，被这一步重新定过。"
          : "";
    const end = slotId === "5.4"
      ? "到门前时，你已经没空慢慢选。"
      : slotId === "5.1"
        ? "警报一响，后面就只剩抢先。"
        : "后面你得把动作放得更快。";
    return compactRouteParagraph("ziche", [stake || "这一步没白走，但代价会往后拖。", exposure, bond, end], slotId === "5.1" || slotId === "5.4" ? 96 : 104);
  }

  function buildAnjieQuote(encounterId, slotId) {
    const slotQuotes = {
      "2.1": "你压低声音提醒自己：“先看证据，再看谁先解释。”",
      "2.2": "你看着人群想：“价值一旦公开，就会立刻变成靶子。”",
      "2.3": "你把笔尖停住：“名单不能写错，错一次就会害死人。”",
      "2.4": "你看着桌边众人：“逻辑一旦端上桌，就不再只属于我。”",
      "3.1": "你握紧笔记本：“从现在开始，每一分钟都得有名字。”",
      "3.2": "你盯着破洞边缘：“路线会说话，前提是我别先骗自己。”",
      "3.3": "你望着异象问自己：“我要带着什么样的答案活下去？”",
      "3.4": "你把纸页压平：“再不把票向推稳，后面就只剩失控。”",
      "4.1": "你盯住卡尔：“今天要么拆穿他，要么被他盖过去。”",
      "4.2": "你听着争辩心想：“每一句辩护，都可能变成新的破绽。”",
      "4.3": "你在落票前提醒自己：“这不是漂亮推理，这是要命的选择。”",
      "4.4": "你看着票纸：“写下名字的人，也得负责名字之后的死活。”",
      "5.2": "你逼自己别停：“门没开之前，崩溃没有用。”",
      "5.3": "你举枪时手心发冷：“我不是不敢开枪，我是不敢承担开枪以后。”",
    };
    if (slotQuotes[slotId]) return slotQuotes[slotId];
    if (slotId === "5.1") return "你喉咙发紧，却还是逼自己开口：“先别崩。位置、路线、出口，至少这些还得有人继续记着。”";
    if (slotId === "5.4") return encounterId === "patrick" ? "你握紧那封信，对她低声说：“我会把名字带出去。可你也别擅自替所有人结束。”" : "你把呼吸压平，提醒自己：“先开门，后回头。现在还不是让情绪赢的时候。”";
    if (encounterId === "patrick") return "你把笔尖停在纸面上，低声对她说：“请先别把自己交给命运，我还没核对完你。”";
    if (encounterId === "karl") return "你看着卡尔，语气很平：“大声不会让你的逻辑变完整，只会让破绽更响。”";
    if (encounterId === "meruru") return "你压低声音问：“你到底是在协助我们逃生，还是在引导我们把故事演完？”";
    return "你把问题问得很短，因为真正有用的答案，往往藏在对方来不及修饰的第一秒。";
  }

  function buildPatrickQuote(encounterId, slotId) {
    const slotQuotes = {
      "1.1": "你在冷光里提醒自己：“先记回声。”",
      "1.2": "你听着众人的呼吸：“先听谁太稳。”",
      "1.3": "你摸过门框：“房间会先露口风。”",
      "1.4": "你停在拐角前：“别错过最轻的声。”",
      "2.1": "你望向深处：“埋着的东西还没干净。”",
      "2.2": "你压低声音：“掀开的帘子落不回去。”",
      "2.3": "你听着震动：“先记门的节奏。”",
      "2.4": "你看着灯下众人：“谁最完整，谁最危险。”",
      "3.1": "你对走廊低声说：“广播停了，送葬没停。”",
      "3.2": "你站在案发处想：“谁怕死，谁怕真相。”",
      "3.3": "你望向天幕：“外面也没打算作证。”",
      "3.4": "你合拢手指：“每句安抚都可能落票。”",
      "4.1": "你看着众人胸口的火：“先看谁想牺牲别人。”",
      "4.2": "你抚过桌沿：“祭具不会说谎。”",
      "4.3": "你低声道：“告别的话，最难撒谎。”",
      "4.4": "你看着票纸：“写下去就不再只是名字。”",
      "5.1": "你在剧痛里留下一句：“快走，趁我还记得你们。”",
      "5.2": "你盯着前路：“先问还能不能活。”",
      "5.3": "你望向装置区：“门会开，代价不会轻。”",
      "5.4": encounterId === "anjie"
        ? "你把最后一点清醒递给她：“替我送出去。”"
        : "你望着白门低声道：“愿它容得下安息。”",
    };
    return slotQuotes[slotId] || "你把声音放轻：“别急着替谁定罪，先听回声落在哪边。”";
  }

  function buildGenericOpeningOverride(roleId, slotId, location, visitCount, intent, module, draftState) {
    const base = getRoleSlotBase(roleId, slotId);
    const detail = getRoleActionDetail(roleId, intent);
    if (!base && !detail) return "";
    const visit = describeSceneVisit(roleId, location, visitCount);
    const action = detail?.opening || `你将“${stripRestLabel(intent.clean)}”当作这一时段最值得下注的动作。`;
    const deduction = detail?.deduction || "这一步未必足够解释一切，却足够替下一轮相遇提前改写一部分空气。";
    const rest = intent.tags.includes("rest")
      ? "你把自己从局势里抽离片刻，试图整理呼吸、姿态或手里的物件。可真正不会停下来的，是别处也在继续往前走的时间。"
      : `你没有让自己只依赖本能，而是把这一步当成接下来许多后果的起点。`;
    return `${visit}${base}${location.mood}在这一刻像主动朝你贴近。${rest}${action}${deduction}${buildModuleStageLine(roleId, module, draftState, "opening")}`;
  }

  function buildGenericEncounterOverride(roleId, encounterId, location, intent, draftState, module) {
    const target = ENTITIES[encounterId]?.short || "对方";
    const positive = intent.tags.includes("social") || intent.tags.includes("protect");
    const aggressive = intent.tags.includes("attack");
    const relation = draftState.relations[encounterId] || 0;
    const stance =
      roleId === "fan"
        ? "你先注意到的往往不是武器或站位，而是对方在恐惧里还想把哪句话硬撑成体面。"
        : roleId === "ziche"
          ? "你第一反应仍旧是算距离、退路和对方有没有可能突然动手。"
          : roleId === "yamada"
            ? "你看着对方的同时，也在确认自己此刻该摆出哪一版表情最不吃亏。"
            : "你嘴上也许还挂着无害的语气，心里已经开始记对方的动作和破绽。";
    const reaction = aggressive
      ? `${target}的警惕立刻被你这一步撬高，连空气都跟着收紧。`
      : positive
        ? `${target}因为你的姿态稍微松了一线，可那点松动究竟会长成信任还是依赖，还得往后看。`
        : `${target}没有立刻交出明确态度，像也在衡量你究竟值不值得被靠近。`;
    const trust = relation >= 12
      ? `你们之间已经累积起一点前情，所以这次相遇远不只是第一次见面时的礼貌交换。`
      : `你不打算让这次接触白白流走，因为在这种地方，下一次再见往往已经隔着新的怀疑。`;
    return `你在${location.name}碰见${target}时，先把局面在心里摆正。${stance}${reaction}${trust}${buildModuleStageLine(roleId, module, draftState, "encounter", encounterId)}`;
  }

  function buildGenericOutcomeOverride(roleId, slotId, encounterId, effects, intent, draftState, module) {
    const finding = buildRoleFindingSentence(roleId, effects, slotId);
    const word = buildRoleWordSentence(roleId, effects);
    const relation = buildRoleRelationSentence(roleId, encounterId, effects, draftState, slotId);
    const cost =
      effects.stats.san < 0
        ? "代价并不抽象。有人是手抖，有人是喉咙发紧，有人则只能靠更熟悉的偏执、冷静或玩笑把自己重新撑起来。"
        : effects.stats.mp < 0 || draftState.stats.mp <= 1
          ? "你把体力、精神或注意力往前透支了一点，好换来这次动作暂时看得见的结果。"
          : "结果没有立刻把局面定死，却足够让你之后的判断不再停留在原地。";
    return `${finding}${word}${relation}${cost}${buildModuleStageLine(roleId, module, draftState, "outcome", encounterId)}`;
  }

  function buildGenericRippleOverride(slotId, encounterId, effects, intent, module, draftState) {
    const stake = intent.tags.includes("rest") ? SLOT_STAKES[slotId]?.rest : SLOT_STAKES[slotId]?.after;
    const exposure = effects.stats.san < 0 || effects.stats.hp < 0
      ? "你的轮廓因此在别人眼里又亮了一点。接下来再想躲回最初那层安全印象后面，会更吃力。"
      : "这一步看似不大，却已经在后面的某个时段里埋下了会被重新翻出来的余波。";
    const bond = effects.flags.emilyProtected
      ? "艾米莉的路线因此朝你这边偏了一点。那份偏移是救赎、拖累还是遗憾，还得看后面谁先撑不住。"
      : effects.flags.karlExposed
        ? "卡尔已经把这笔记在心里。下次再见，他更可能把你当成需要优先处理的麻烦。"
      : effects.flags.patrickBond
          ? "你与派翠克之间那根若隐若现的线被真正拉紧了，终局时它一定会回来索要代价。"
          : "";
    return `${stake || "时间线已经因为这次选择轻轻偏了一下。"}${exposure}${bond}${buildModuleStageLine(draftState.selectedRole || "fan", module, draftState, "ripple", encounterId)}`;
  }

  function buildGenericQuoteOverride(roleId, encounterId, slotId) {
    const target = encounterId ? ENTITIES[encounterId].short : "对方";
    if (slotId === "5.1") {
      return roleId === "fan"
        ? "你几乎是在哭着念出祷词：“别在这里失去名字，别让这地方替你定义结局。”"
        : roleId === "ziche"
          ? "你盯着前方，咬紧牙关：“别愣着。能跑的跑，能挡的挡，别把命浪费在尖叫上。”"
          : roleId === "yamada"
            ? "你压下嗓音里的颤：“现在开始别演了。想活的，就先跟上我。”"
            : "你挤出一口气，低声骂了一句：“行吧，真到要命的时候，还是得有人把烂摊子捡起来。”";
    }
    if (roleId === "fan") {
      switch (slotId) {
        case "1.1": return "你低声提醒自己：“先别把恐惧听成启示。”";
        case "1.2": return `你轻声对${target}说：“慢一点。先把真正害怕的东西说出来。”`;
        case "2.1": return "你按住胸口：“别急着献上答案，先看它要你交什么。”";
        case "2.4": return "你看着桌边众人：“若一定要有人承担，就先让我看清谁在推。”";
        case "3.3": return "你低声说：“死者已经开口了，活人别再拿沉默装无辜。”";
        case "4.4": return "你看着票纸：“写下名字之前，先想想你想把谁交出去。”";
        case "5.2": return "你喘着气念道：“别回头。活着出去，再替她们记。”";
        case "5.3": return "你压低声音：“门会开，可不是所有代价都会留在门里。”";
        case "5.4": return `你对${target}轻声说：“先出去。宽恕这种事，等活下来再谈。”`;
        default: return `你轻声对${target}说：“先说真话，别急着替自己求赦。”`;
      }
    }
    if (roleId === "ziche") {
      switch (slotId) {
        case "1.1": return "你低声骂了一句：“先把门算明白。”";
        case "1.2": return `你扫了${target}一眼：“靠墙站，别挡我视线。”`;
        case "2.1": return "你摸着炉壁想：“先看结构，别听鬼话。”";
        case "2.4": return `你对${target}说：“废话先省了，把能用的线索报出来。”`;
        case "3.3": return `你盯着${target}：“要么帮忙，要么离我远点。”`;
        case "4.4": return "你按住票纸：“不站队的人，死得最快。”";
        case "5.2": return "你咬紧牙关：“跑你的，后面我来卡。”";
        case "5.3": return "你看着出口：“现在开始，每一步都按秒算。”";
        case "5.4": return `你对${target}低喝：“门一开就走，别回头。”`;
        default: return `你盯着${target}：“把有用的先拿出来。”`;
      }
    }
    if (roleId === "yamada") return `你把声音放得恰到好处：“你可以继续装，我也可以继续看。我们都别急。”`;
    if (roleId === "debora") {
      switch (slotId) {
        case "1.1": return `你朝${target}挤出个笑：“规则我听见了，脸色我也会记住。”`;
        case "1.2": return `你对${target}摆摆手：“先别急，阿姨我耳朵还灵，谁慌我还是听得出来的。”`;
        case "2.4": return `你冲${target}笑了一下：“谁在抢着圆谎，我这种老油条还是听得出来的。”`;
        case "3.3": return `你低声对${target}说：“先别碰，谁一看尸体就慌，我一眼就认得出来。”`;
        case "4.4": return `你看着${target}说：“票你照样写，脸色我替你记着，回头谁也别装忘了。”`;
        case "5.1": return `你吸了口气，对${target}说：“现在别装镇定，想活就先跟上，后面的烂摊子我来看。”`;
        case "5.4": return `你对${target}说：“门就在前面，先走，别把心虚和后悔都拖到最后一脚。”`;
        default: return `你对${target}干笑道：“阿姨我话不多，但谁在心虚、谁在装，我还是看得出来的。”`;
      }
    }
    if (roleId === "patrick") return `你盯着${target}，低声说：“别急着把答案说死，先听回声落在哪边。”`;
    return "";
  }

  function buildYamadaQuote(encounterId, slotId) {
    const target = encounterId ? ENTITIES[encounterId].short : "对方";
    switch (slotId) {
      case "1.1": return "你低声说：“先把规则听完，再决定谁更像猎物。”";
      case "1.2": return "你说：“先让我看清谁最急着解释自己。”";
      case "1.3": return "你说：“我可以陪你走，但你得先把话说准。”";
      case "1.4": return `你对${target}说：“先别抢着定性，错一次就够了。”`;
      case "2.1": return "你说：“机器我可以碰，底牌我不会交。”";
      case "2.2": return "你说：“先把没说完的那半句吐出来。”";
      case "2.3": return "你说：“我还没倒，别急着把我归进废物那边。”";
      case "2.4": return "你说：“先别把牌摊开，我还没看够他们的脸。”";
      case "3.1": return "你说：“梅露露死了，先别让表情替你作证。”";
      case "3.2": return "你说：“先把消息连起来，再谈谁像凶手。”";
      case "3.3": return "你说：“别看我，我现在只想把脸撑住。”";
      case "3.4": return "你说：“该交代的我会交代，但不是现在。”";
      case "4.1": return "你说：“先别定罪，证据还没排完。”";
      case "4.2": return "你说：“如果真要出事，先护艾米莉。”";
      case "4.3": return "你说：“真相可以晚点听，先听完这段录音。”";
      case "4.4": return "你说：“票先落下，后面的脸我来记。”";
      case "5.1": return "你压低声音：“现在开始别演了，想活的跟上。”";
      case "5.2": return "你说：“别怕，我还在。”";
      case "5.3": return "你说：“出口就在前面，先别倒。”";
      case "5.4": return "你说：“门开了，但我还不想把真脸交出去。”";
      default: return `你对${target}低声道：“先别急，我还在看。”`;
    }
  }

  function buildAnchorBeat(roleId, slotId, intent, encounterId, effects, draftState) {
    if (slotId === "1.1") {
      const intro = roleId === "patrick"
        ? "对讲机里的梅露露把规则一条条念出来：五小时、投票、四台发电机、四个密码词，还有一场被叫成游戏的献祭。"
        : roleId === "anjie"
          ? "对讲机里的梅露露把规则拆成极漂亮也极危险的五个小时：投票、发电机、密码词、行动限制，还有一场被伪装成流程的处决。"
          : "对讲机里的梅露露依旧用那种过分轻软的声音解释规则：五小时、投票、四台发电机、四个密码词，以及一场被故意讲得像游戏的献祭。";
      const tint = getTruthTier(draftState.stats.truth) >= 2
        ? "你听得出，这不只是说明规则，更像有人早就排好了结局。"
        : "她说得越客气，这套规则越像排练过很多次。";
      return `${intro}${tint}`;
    }
    if (slotId === STORY_ANCHORS.firstGather) {
      const clues = draftState.clues.length ? `第一轮线索已经在各人手里长出不同形状，${draftState.clues.slice(0, 3).join("、")}这些名字开始决定谁先开口。` : "第一轮见面时，谁都还拿着表面的礼貌，真正的判断却已经先在眼神里排队。";
      const trust = draftState.relations.patrick > 10 || draftState.relations.emily > 10
        ? "你能感觉到，至少有一两个人已经在不动声色地站队。"
        : "更多人还在试探，像怕一开口就把自己推成靶子。";
      return `${clues}${trust}`;
    }
    if (slotId === STORY_ANCHORS.secondGather) {
      const allianceText = Object.keys(draftState.alliances || {}).length
        ? "有人已经结成临时同盟，也有人把同盟两个字说得比敌意还轻。"
        : "所有人都把各自的碎片证据端上桌，却没有谁真的愿意先把底牌亮全。";
      const suspicionText = draftState.flags.karlExposed
        ? "卡尔的名字在这张桌子上已经不只是名字，更像一处正慢慢发热的裂口。"
        : "谁先补充，谁先隐瞒，几乎比线索本身更值得警惕。";
      return roleId === "patrick"
        ? `你回到聚集点时，大厅里已经堆满了别人带回来的声音和线索。焚烧房的焦痕、藤蔓房的喘息、藏书馆的拉丁文和电闸房的机械声全被拖到同一盏灯下。${allianceText}${suspicionText}`
        : `你回到聚集点时，大厅已经像一张被硬摊平的证物桌。焚烧房的焦痕、藤蔓房的呼吸、藏书馆的拉丁文和电闸房的机械声被拽到同一盏灯下。${allianceText}${suspicionText}`;
    }
    if (slotId === STORY_ANCHORS.meruruDeath) {
      const grief = draftState.flags.meruruBlessing
        ? "如果说还有什么比死亡更快，那就是你们此前对她的误判被同时改写。"
        : "那句通知没有留下任何修辞空间。";
      const karl = draftState.suspicion.player.karl > 20 || draftState.flags.karlExposed
        ? "几乎所有人都下意识看向卡尔，而卡尔也第一次没能把那份压力完全压回去。"
        : "整个疗养院却在这之后忽然安静得不正常，像所有门都在等别人先开第一把。";
      return roleId === "patrick"
        ? `广播突然切下来。梅露露死了。${grief}${karl}`
        : `广播像刀一样从天花板上落下来。梅露露死了。${grief}${karl}`;
    }
    if (slotId === "4.4") {
      const voteLead = draftState.keyChoices.vote_target
        ? `你先前埋下的票向已经开始回头咬人：${draftState.keyChoices.vote_target === "karl" ? "卡尔" : draftState.keyChoices.vote_target === "patrick" ? "派翠克" : draftState.keyChoices.vote_target === "self" ? "你自己" : "所有人"}都不会再被同样地看待。`
        : "每个人都在把最后一点犹豫换成借口。";
      return `票纸一张张折起，石室里的呼吸也跟着压低。你已经知道，没人能若无其事地坐回原位。${voteLead}`;
    }
    if (slotId === STORY_ANCHORS.patrickAwakening || slotId === "5.1") {
      if (!isEntityAlive(draftState, "patrick")) {
        return "第五小时仍然准时到来，可原本应该由派翠克承担的那场异变被硬生生截断了。警报照样响，门外的风压照样逼近，活下来的人却只能面对一个被投票提前撕开的残局。";
      }
      const mercyText = draftState.flags.patrickMercy
        ? "那阵异变没有立刻吞掉所有人，因为至少有一部分人曾经把他当成还能被拉回来的名字。"
        : "这场觉醒没有给任何人留出温和收场的余地。";
      const roleText = roleId === "patrick"
        ? "你先听见体内那阵迟到了太久的应答。它不像外来的声音，更像一直趴在骨缝背后等待苏醒的某种饥饿。"
        : "警报和尖叫几乎同时响起。派翠克的轮廓先在灯下扭曲，随后才生出真正会让人后退的形状。";
      const stateText = getTruthTier(draftState.stats.truth) >= 3
        ? "如果你曾经相信这地方还有一层可解释的边界，那么那层边界就在这一秒当着你的面烧穿了。"
        : "那不只是怪物的出现，更像整个疗养院终于决定用最直接的方式执行它原本就写好的终局。";
      return roleId === "patrick"
        ? `${roleText}${mercyText}${getTruthTier(draftState.stats.truth) >= 3 ? "你知道，自己已经回不到原来的那一边。" : "这座疗养院终于把真正的终局亮给你看了。"}`
        : `${roleText}${mercyText}${stateText}`;
    }
    if (slotId === "5.4") {
      const gate = draftState.generators.progress >= 4
        ? "门已经准备好把人放出去。"
        : "门仍像一块冷下来的判决书，等最后一个名字被写上去。";
      const choice = draftState.keyChoices.final_choice === "sacrifice"
        ? "你带着那个必须有人付出的答案走到这里。"
        : "你一路带来的，是活下去的冲动和不能轻易放下的亏欠。";
      return roleId === "patrick"
        ? `门会在这一刻开。白光从缝里压出来时，你一时分不清那是出口，还是另一场更大的梦。${gate}${choice}`
        : `门会在这一刻开，或者被时间逼着开。白光从缝里压出来时，你忽然分不清那到底是出口、审判之后的缓刑，还是另一种更宽敞的梦。${gate}${choice}`;
    }
    return "";
  }

  function buildOpeningParagraph(roleId, slotId, slot, location, visitCount, intent, module, draftState) {
    if (intent.tags.includes("rest")) {
      const genericRest = buildRestIntrospection(roleId, slotId, location, draftState);
      const rolePassage = buildRoleModulePassage(roleId, slotId, "opening", module, draftState, null);
      if (roleId === "anjie") return `${buildAnjieOpeningParagraph(slotId, location, visitCount, intent)}${genericRest}${rolePassage}${buildModuleStageLine(roleId, module, draftState, "opening")}`;
      if (roleId === "patrick") return `${buildPatrickOpeningParagraph(slotId, location, visitCount, intent)}${genericRest}${rolePassage}`;
      if (roleId === "yamada") return `${buildYamadaOpeningParagraph(slotId, location, visitCount, intent)}${rolePassage}`;
      const genericOverride = buildGenericOpeningOverride(roleId, slotId, location, visitCount, intent, module, draftState);
      return `${genericOverride}${genericRest}${rolePassage}`;
    }
    const rolePassage = buildRoleModulePassage(roleId, slotId, "opening", module, draftState, null);
    if (roleId === "anjie") {
      const compactAnchorSlots = new Set(["3.3", "5.1"]);
      const suppressedPassage = compactAnchorSlots.has(slotId) ? "" : rolePassage;
      const suppressedStageLine = compactAnchorSlots.has(slotId) ? "" : buildModuleStageLine(roleId, module, draftState, "opening");
      return buildAnjieOpeningParagraph(slotId, location, visitCount, intent) + suppressedPassage + suppressedStageLine;
    }
    if (roleId === "patrick") {
      const compactAnchorSlots = new Set(["3.3", "4.4", "5.1", "5.4"]);
      const suppressedPassage = compactAnchorSlots.has(slotId) ? "" : rolePassage;
      return buildPatrickOpeningParagraph(slotId, location, visitCount, intent) + suppressedPassage;
    }
    if (roleId === "yamada") return buildYamadaOpeningParagraph(slotId, location, visitCount, intent) + rolePassage;
    if (roleId === "debora") {
      const suppressedPassage = new Set(["3.3", "4.4", "5.1", "5.4"]).has(slotId) ? "" : rolePassage;
      return dedupeJoinedNarrative(buildDeboraOpeningParagraph(slotId, location, visitCount, intent) + suppressedPassage);
    }
    if (roleId === "fan") {
      const suppressedPassage = new Set(["3.3", "4.4", "5.1", "5.4"]).has(slotId) ? "" : rolePassage;
      return dedupeJoinedNarrative(buildFanOpeningParagraph(slotId, location, visitCount, intent) + suppressedPassage);
    }
    if (roleId === "ziche") {
      const suppressedPassage = new Set(["1.1", "3.3", "4.4", "5.1", "5.4"]).has(slotId) ? "" : rolePassage;
      return dedupeJoinedNarrative(buildZicheOpeningParagraph(slotId, location, visitCount, intent) + suppressedPassage);
    }
    const genericOverride = buildGenericOpeningOverride(roleId, slotId, location, visitCount, intent, module, draftState);
    if (genericOverride) return `${genericOverride}${rolePassage}`;
    const prefix = visitCount > 0
      ? `你再次靠近${location.name}。`
      : `你朝着${location.name}走去。`;
    if (roleId === "fan") {
      return `${prefix}${location.mood}先一步裹住你的呼吸，像一间临时搭好的告解室。你把“${stripRestLabel(intent.clean)}”当成一场被递到掌心里的试炼，甚至在心里先为它找好了经文注脚。只要痛感、霉味和警报都还在，你就还分得清自己没有从这场噩梦里醒来，而是被它认真地选中了。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "opening")}`;
    }
    if (roleId === "ziche") {
      return `${prefix}${location.mood}没有吓住你，反而像一排能被立刻登记的客观参数。死角、退路、落脚点、能不能抄近路、有没有人会从背后摸上来，你先把这些东西在脑子里过了一遍，才允许自己去想“规则”这种第二位的问题。对你来说，先活着，别的都能往后排。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "opening")}`;
    }
    if (roleId === "yamada") {
      return `${prefix}${location.mood}让你先把脚步放轻。你维持着那张最安全的脸，同时开始盘算这一步会漏出多少真实。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "opening")}`;
    }
    if (roleId === "anjie") {
      return `${prefix}${location.mood}让你脑中的三条假设同时亮了起来。你一边压住过快的心跳，一边把“${stripRestLabel(intent.clean)}”拆成更具体的目标：你要看见什么、验证什么、拿走什么、又准备在什么地方留下自己的痕迹。只要还能列出步骤，你就还能把恐惧控制在笔尖以下。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "opening")}`;
    }
    if (roleId === "debora") {
      return `${prefix}${location.mood}让你差一点本能地皱起眉。你及时把那个更像行内人的表情压了回去，换成更安全的那一张脸：有点累、有点慌、像跟不上局势的中年人。只有你自己知道，“${stripRestLabel(intent.clean)}”这种动作看着随便，实则每一步都在替退路和把柄重新洗牌。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "opening")}`;
    }
    return `${prefix}${location.mood}沿着墙和灯影慢慢滑进你的知觉，像一段来自彼世的低语。你做出“${stripRestLabel(intent.clean)}”这件事时，心里并没有真正的迟疑。并非因为不怕，而是因为你比其他人更早听见了这座疗养院真正想被谁碰触、又真正想把谁留下。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "opening")}`;
  }

  function buildEncounterParagraph(roleId, slotId, encounterId, location, intent, draftState, module) {
    const rolePassage = buildRoleModulePassage(roleId, slotId, "encounter", module, draftState, encounterId);
    if (roleId === "anjie") {
      const compactAnchorSlots = new Set(["3.3", "5.1"]);
      const suppressedPassage = compactAnchorSlots.has(slotId) ? "" : rolePassage;
      const suppressedStageLine = compactAnchorSlots.has(slotId) ? "" : buildModuleStageLine(roleId, module, draftState, "encounter", encounterId);
      return buildAnjieEncounterParagraph(slotId, encounterId, location, intent, draftState) + suppressedPassage + suppressedStageLine;
    }
    if (roleId === "patrick") {
      const compactAnchorSlots = new Set(["3.3", "4.4", "5.1", "5.4"]);
      const suppressedPassage = compactAnchorSlots.has(slotId) ? "" : rolePassage;
      return buildPatrickEncounterParagraph(slotId, encounterId, location, intent, draftState) + suppressedPassage;
    }
    if (roleId === "yamada") return buildYamadaEncounterParagraph(slotId, encounterId, location, intent, draftState) + rolePassage;
    if (roleId === "debora") {
      const suppressedPassage = new Set(["3.3", "4.4", "5.1", "5.4"]).has(slotId) ? "" : rolePassage;
      return dedupeJoinedNarrative(buildDeboraEncounterParagraph(slotId, encounterId, location, intent, draftState) + suppressedPassage);
    }
    if (roleId === "fan") {
      const suppressedPassage = new Set(["3.3", "4.4", "5.1", "5.4"]).has(slotId) ? "" : rolePassage;
      return dedupeJoinedNarrative(buildFanEncounterParagraph(slotId, encounterId, location, intent, draftState) + suppressedPassage);
    }
    if (roleId === "ziche") {
      const suppressedPassage = new Set(["1.1", "3.3", "4.4", "5.1", "5.4"]).has(slotId) ? "" : rolePassage;
      return dedupeJoinedNarrative(buildZicheEncounterParagraph(slotId, encounterId, location, intent, draftState) + suppressedPassage);
    }
    const genericOverride = buildGenericEncounterOverride(roleId, encounterId, location, intent, draftState, module);
    if (genericOverride) return `${genericOverride}${rolePassage}`;
    const encounter = ENTITIES[encounterId];
    const targetName = encounter?.short || "某个模糊的人影";
    const positive = intent.tags.includes("social") || intent.tags.includes("protect");
    const aggressive = intent.tags.includes("attack");
    if (roleId === "fan") {
      const reaction = aggressive ? "对方的肩背一下子绷紧，像已经预感到你那份温柔会长出倒刺。" : positive ? `${targetName}看你的眼神先是迟疑，随后被你刻意放缓的语气拽住。` : `${targetName}没有立刻接话，只让那点沉默在你们之间停得很慢。`;
      return `你很快碰见了${targetName}。你先把声音放轻，像是在对一位尚未决定是否忏悔的弟兄或姊妹说话。${reaction}你并不急着把话一次说尽，因为你知道，真正能留下痕迹的往往不是论证本身，而是人面对被理解或被逼视时那一瞬间的呼吸。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "encounter", encounterId)}`;
    }
    if (roleId === "ziche") {
      const reaction = aggressive ? `${targetName}本能地后撤了半步，你则顺势把距离卡成最有利的长度。` : positive ? `${targetName}大概没想到你会先开口，于是把警惕压成了短暂的停顿。` : `${targetName}试图从你的表情里读出立场，可你没给。`;
      return `角落里的脚步声替你先报了信。你和${targetName}的视线撞上时，脑子里最先弹出来的还是“能不能利用”。${reaction}你并不相信任何一场相遇是偶然，尤其在这种地方。谁先出现，谁先解释，谁的手离武器更近，都是比礼貌更可靠的材料。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "encounter", encounterId)}`;
    }
    if (roleId === "yamada") {
      const reaction = aggressive ? `你记下了${targetName}眼底那一下收缩。` : positive ? `${targetName}被你放软的口气骗慢了一瞬。` : `${targetName}还是没看清你想要什么。`;
      return `你见到了${targetName}。先出场的还是那张无害的脸。${reaction}你不急着赢，只想让对方多露一点。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "encounter", encounterId)}`;
    }
    if (roleId === "anjie") {
      const reaction = aggressive ? `${targetName}的反应比语言更快，像已经把你记进了下一轮的敌意名单。` : positive ? `${targetName}的态度因为你的措辞和证据稍微松了一线，这一点变化足够你继续下注。` : `${targetName}说的每一个字都像证词，可你知道证词从来不只存在于嘴里。`;
      return `你和${targetName}对上视线的那一瞬间，几乎立刻就在心里给这段对话列了提纲。先确认对方在意什么，再判断对方怕什么，最后决定该拿情报、逻辑还是沉默去推这一把。${reaction}你甚至能听见自己在心里写下一句注释：此人后续票向与态度，值得继续观察。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "encounter", encounterId)}`;
    }
    if (roleId === "debora") {
      const reaction = aggressive ? `你差点露出真正会让人害怕的那种眼神，好在最后还是及时换回了更无害的表情。` : positive ? `${targetName}大概把你当成了最没威胁的那个，于是比面对别人时更愿意停下来。` : `${targetName}拿不准你是真没跟上，还是故意装没跟上。`;
      return `你碰见${targetName}时，先让自己像一个会被这地方轻易吓懵的普通人。手足无措、语气发虚、甚至抱怨一句“阿姨真跟不上”，这些都比亮出真正的判断安全得多。${reaction}可在更深一点的地方，你已经悄悄把对方的站位、习惯和反应速度全部收进了旧有的经验里。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "encounter", encounterId)}`;
    }
    const reaction = aggressive ? `${targetName}在你的注视下明显僵住，像终于察觉到你看到的不止是表面。` : positive ? `${targetName}先是迟疑，随后被你温和却过分准确的观察逼得低下了视线。` : `${targetName}似乎不太明白你为什么会在这时这样安静，可安静本身就是你在询问。`;
    return `你在${location.name}里见到了${targetName}。与其说是“看见”，不如说是先感知到对方的灵魂在这一刻有多明亮、又有多碎。${reaction}你并不急着把自己知道的全说出来，因为真正的通灵从来不靠大声，它更像把一枚针稳稳压进别人最不愿被触碰的地方。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "encounter", encounterId)}`;
  }

  function buildOutcomeParagraph(roleId, slotId, encounterId, effects, intent, draftState, module) {
    const rolePassage = buildRoleModulePassage(roleId, slotId, "outcome", module, draftState, encounterId);
    if (roleId === "anjie") {
      const compactAnchorSlots = new Set(["3.3", "5.1"]);
      const suppressedPassage = compactAnchorSlots.has(slotId) ? "" : rolePassage;
      const suppressedStageLine = compactAnchorSlots.has(slotId) ? "" : buildModuleStageLine(roleId, module, draftState, "outcome", encounterId);
      return dedupeJoinedNarrative(buildAnjieOutcomeParagraph(slotId, encounterId, effects, intent, draftState) + suppressedPassage + suppressedStageLine);
    }
    if (roleId === "patrick") {
      const suppressedPassage = new Set(["3.3", "4.4", "5.1", "5.4"]).has(slotId) ? "" : rolePassage;
      return dedupeJoinedNarrative(buildPatrickOutcomeParagraph(slotId, encounterId, effects, intent, draftState) + suppressedPassage);
    }
    if (roleId === "yamada") return dedupeJoinedNarrative(buildYamadaOutcomeParagraph(slotId, encounterId, effects, intent, draftState) + rolePassage);
    if (roleId === "debora") {
      const suppressedPassage = new Set(["3.3", "4.4", "5.1", "5.4"]).has(slotId) ? "" : rolePassage;
      return dedupeJoinedNarrative(buildDeboraOutcomeParagraph(slotId, encounterId, effects, intent, draftState) + suppressedPassage);
    }
    if (roleId === "fan") {
      const suppressedPassage = new Set(["3.3", "4.4", "5.1", "5.4"]).has(slotId) ? "" : rolePassage;
      return dedupeJoinedNarrative(buildFanOutcomeParagraph(slotId, encounterId, effects, intent, draftState) + suppressedPassage);
    }
    if (roleId === "ziche") {
      const suppressedPassage = new Set(["3.3", "5.1", "5.4"]).has(slotId) ? "" : rolePassage;
      return dedupeJoinedNarrative(buildZicheOutcomeParagraph(slotId, encounterId, effects, intent, draftState) + suppressedPassage);
    }
    const genericOverride = buildGenericOutcomeOverride(roleId, slotId, encounterId, effects, intent, draftState, module);
    if (genericOverride) return dedupeJoinedNarrative(`${genericOverride}${rolePassage}`);
    const clueText = effects.addClues.length
      ? `你因此抓住了${effects.addClues.join("、")}这些更像证物的东西。`
      : "你没有拿到能立刻翻盘的铁证，却把局势的纹理摸得更清楚了一点。";
    const wordText = effects.addWords.length ? `新的密码词“${effects.addWords.join("、")}”在你的记录里落了下来。` : "";
    const relationText = encounterId && effects.relations[encounterId]
      ? `${ENTITIES[encounterId].short}对你的态度发生了细小但无法撤销的偏移。`
      : "";
    if (roleId === "fan") {
      return dedupeJoinedNarrative(`${clueText}${wordText}${relationText}你把这一切都先译成了更容易承受的语言：这是考验，也是提醒；是别人暴露的罪，也是你自己正在滋长的罪。尤其当你的选择带来一点伤口、一点眩晕或一点异样的平静时，你甚至会本能地怀疑，那是不是你最熟悉、也最危险的那种安慰。你一边想把结果理解成恩典，一边又知道恩典从来不会这么轻易落到人手里。也正因为知道，你才更难放过自己在这一刻究竟是出于慈悲、偏执，还是出于某种终于能证明自己仍被注视着的渴望。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "outcome", encounterId)}`);
    }
    if (roleId === "ziche") {
      return dedupeJoinedNarrative(`${clueText}${wordText}${relationText}这些成果在你脑子里立刻变成了新的资源分布图：谁更可信、哪里更危险、哪台设备还值得抢救、哪一条路以后必须绕开。你并不在乎过程够不够体面，重要的是它确实让你比十五分钟之前多握住了一点主动权。哪怕这主动权只是多一把顺手的铁器、多一条晚点才会被别人发现的后路、或者多一个你已经确认一旦出事就会先坏事的人，也足够让你在下一次转角前把脚步放得更稳一点。你从不把这种稳当成宽慰，它更像一笔暂时还没被夺走的资本。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "outcome", encounterId)}`);
    }
    if (roleId === "yamada") {
      return dedupeJoinedNarrative(`${clueText}${wordText}${relationText}你表面上还稳着，心里却已经把刚才的眼神、停顿和漏洞全部记下。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "outcome", encounterId)}`);
    }
    if (roleId === "anjie") {
      return dedupeJoinedNarrative(`${clueText}${wordText}${relationText}你迅速把它们并进笔记里的假设链条，删掉一条，再补上两条。逻辑仍然没有完全闭合，可至少没有彻底断裂。只要还能继续校正、继续求证，你就还能说服自己：这场噩梦并非不可理解，它只是暂时还没有被拆到足够细。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "outcome", encounterId)}`);
    }
    if (roleId === "debora") {
      return dedupeJoinedNarrative(`${clueText}${wordText}${relationText}你嘴上也许仍旧会说自己只是运气好、只是瞎碰到，可身体比谎言诚实得多。你知道哪些角落该避，哪些人已经开始把你重新归类，哪些线索一旦公开就再也收不回来。那份熟悉感让你厌恶，也让你在这种局里活得比别人顺手。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "outcome", encounterId)}`);
    }
    return dedupeJoinedNarrative(`${clueText}${wordText}${relationText}你能感觉到这段结果不是单纯的“得到”或“失去”，更像某扇门在你心里又开了一条缝。缝里涌进来的除了真相，还有他人的痛、建筑的回声，以及那些原本不该由活人替亡者承担的重量。你拿走它们的时候，已经知道之后总要还。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "outcome", encounterId)}`);
  }

  function buildRippleParagraph(roleId, slotId, encounterId, effects, intent, draftState, module) {
    const rolePassage = buildRoleModulePassage(roleId, slotId, "ripple", module, draftState, encounterId);
    if (roleId === "anjie") {
      const compactAnchorSlots = new Set(["3.3", "5.1"]);
      const suppressedPassage = compactAnchorSlots.has(slotId) ? "" : rolePassage;
      const suppressedStageLine = compactAnchorSlots.has(slotId) ? "" : buildModuleStageLine(roleId, module, draftState, "ripple", encounterId);
      return buildAnjieRippleParagraph(slotId, encounterId, effects, intent) + suppressedPassage + suppressedStageLine;
    }
    if (roleId === "patrick") {
      const suppressedPassage = new Set(["3.3", "4.4", "5.1", "5.4"]).has(slotId) ? "" : rolePassage;
      return buildPatrickRippleParagraph(slotId, encounterId, effects, intent) + suppressedPassage;
    }
    if (roleId === "yamada") return buildYamadaRippleParagraph(slotId, encounterId, effects, intent) + rolePassage;
    if (roleId === "debora") {
      const suppressedPassage = new Set(["3.3", "4.4", "5.1", "5.4"]).has(slotId) ? "" : rolePassage;
      return dedupeJoinedNarrative(buildDeboraRippleParagraph(slotId, encounterId, effects, intent) + suppressedPassage);
    }
    if (roleId === "fan") {
      const suppressedPassage = new Set(["3.3", "4.4", "5.1", "5.4"]).has(slotId) ? "" : rolePassage;
      return dedupeJoinedNarrative(buildFanRippleParagraph(slotId, encounterId, effects, intent) + suppressedPassage);
    }
    if (roleId === "ziche") return buildZicheRippleParagraph(slotId, encounterId, effects, intent) + rolePassage;
    const genericOverride = buildGenericRippleOverride(slotId, encounterId, effects, intent, module, draftState);
    if (genericOverride) return `${genericOverride}${rolePassage}`;
    const missed = intent.tags.includes("rest")
      ? "你停下来的这十五分钟里，别处先响起了金属拖拽声和谁压得很低的争执。等你再动身时，那场小小的先机已经不属于你。"
      : "";
    const danger = isHeavyInjury(draftState) || getSanState(draftState) !== "normal"
      ? "更糟的是，这次选择已经把你在别人眼里的轮廓抬亮了。之后再想保持模糊，会比现在难得多。"
      : "";
    const bond = effects.flags.patrickBond
      ? "你与派翠克之间那条原本若有若无的线，被这一次动作真正系紧了。到了终局，它很可能会替你挡一次刀，也可能逼你直视一次背叛。"
      : effects.flags.emilyProtected
        ? "艾米莉的命运因此向你这边偏了一点。她以后是会跟着你跑，还是拖着你一起陷下去，都将从这里开始分岔。"
        : effects.flags.karlExposed
          ? "卡尔不会忘记这一笔。无论你是逼视、反驳还是质问，他之后都更可能把你放进“需要处理”的那一列。"
          : "";
    if (roleId === "fan") {
      return `${missed || "你没有办法把后果只解释成偶然。"}${danger} ${bond}你心里已经提前浮现出了下一轮要面对的名字，像提前写好的代祷名单。只是这一次，你也知道名单上的人很可能包括你自己。更糟的是，你开始明白代祷并不总能换来平安，它很多时候只是在替之后必然会到来的撕裂，提前准备一种比较不难看的说法。你当然还会继续祈祷，可你已经很难再像最开始那样，单纯相信祈祷本身足够让事情变轻。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "ripple", encounterId)}`;
    }
    if (roleId === "ziche") {
      return `${missed || "这一步没有白走，但也绝不免费。"}${danger} ${bond}你把刚才的得失在脑中重新计价，立刻得出一个结论：之后的每十五分钟都要更快、更狠，最好比别人先一步把门、证据和生路都抢到手。你几乎能预见接下来的局势会怎样报复一切犹豫，所以连回头确认都变成了一种成本。你不喜欢自己总是这么想，可你也知道，真正到终局时，能让人活下来的往往不是漂亮话，而是你现在这种已经开始显得过分冷的预判。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "ripple", encounterId)}`;
    }
    if (roleId === "yamada") {
      return `${missed || "你知道自己已经把后面的空气拧偏了一点。"}${danger} ${bond}下次再碰面时，别人会带着这一步留下的印象先开口。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "ripple", encounterId)}`;
    }
    if (roleId === "anjie") {
      return `${missed || "你在心里给这次选择打上了“会在两到三段时序后回响”的标记。"}${danger} ${bond}你几乎能预见之后的某个投票、某句质询、某次追逐会因为这一刻被推向完全不同的方向。问题只剩一个：到时候你是否来得及承担它。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "ripple", encounterId)}`;
    }
    if (roleId === "debora") {
      return `${missed || "你比谁都清楚，小决定最容易在后面长成大事故。"}${danger} ${bond}接下来你得一边继续扮演那个没什么用的阿姨，一边防着这次行动留下的余波把你过去的反应方式整个拖回台前。你未必愿意，但你很清楚自己已经在往那个方向走。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "ripple", encounterId)}`;
    }
    return `${missed || "这段回响并不会立刻结束。"}${danger} ${bond}你已经隐约听见后面的门在动了。那不是单纯的脚步或风声，而是某条命运线因为你的触碰改了角度，正准备在更靠后的时段里，向你索取真正的代价。${rolePassage}${buildModuleStageLine(roleId, module, draftState, "ripple", encounterId)}`;
  }

  function buildQuote(roleId, encounterId, intent, slotId) {
    if (roleId === "anjie") return buildAnjieQuote(encounterId, slotId);
    if (roleId === "patrick") return buildPatrickQuote(encounterId, slotId);
    if (roleId === "yamada") return buildYamadaQuote(encounterId, slotId);
    const genericOverride = buildGenericQuoteOverride(roleId, encounterId, slotId);
    if (genericOverride) return genericOverride;
    const target = encounterId ? ENTITIES[encounterId].short : "对方";
    if (slotId === "4.4") return `系统广播：票纸落下之后，任何人都不能假装自己只是旁观者。`;
    if (slotId === "5.1") return roleId === "patrick" ? `你听见自己骨缝里的回音说：现在轮到你成为门。` : `警报：第五小时开始。请参与者自行承担终局后果。`;
    if (roleId === "fan") return `你轻声对${target}说：“我会记住这份罪，也会记住你为什么走到这里。”`;
    if (roleId === "ziche") return `你盯着${target}，只留下一句：“别挡路，也别让我替你收尸。”`;
    if (roleId === "anjie") return `你合上笔记本时对${target}说：“先别急着演，我还没把你的逻辑看完。”`;
    if (roleId === "debora") return `你笑得像在打圆场：“阿姨我可能不懂大道理，但这种局总归有人在撒谎吧。”`;
    return `你对${target}低声道：“灵魂发抖的时候，说出口的话往往比沉默诚实。”`;
  }

  function buildGeneralStateRipple(effects, draftState) {
    if (isHeavyInjury(draftState)) return "剧痛让你连判断都变短了。";
    if (getSanState(draftState) === "insight") return "墙角的阴影开始像在动。";
    if (getSanState(draftState) === "truth") return `你看见真实，${getTruthTierLabel(draftState.stats.truth)}。`;
    if (effects.generatorGain > 0) return getGeneratorNotice(draftState.generators.progress);
    return "";
  }

  function buildNextNotice(roleId, slotId, encounterId, effects, intent) {
    if (effects.generatorGain > 0) {
      const progress = state.generators.progress;
      const generatorText = getGeneratorNotice(progress) || "发电机已经被修好了一台。";
      if (intent.generatorOpportunityKind === "support") {
        return `${generatorText} 你刚才的协助已经接进供电线路，下一时段能明显看见灯色更稳。`;
      }
      if (intent.generatorOpportunityKind === "fallback") {
        return `${generatorText} 这次补救把白门条件往前追回一格，下一时段不会再只剩纸面规则。`;
      }
      return `${generatorText} 那台发电机已经被修理完成，下一时段的走廊灯和白门机关都会给出明确回应。`;
    }
    if (slotId === STORY_ANCHORS.secondGather) {
      return roleId === "patrick"
        ? "第二次聚集之后，谁都没法再装作彼此刚认识。"
        : "第二次聚集之后，所有人彼此之间都少了一层缓冲。再见面时，谁都不可能再装成刚认识。";
    }
    if (slotId === STORY_ANCHORS.meruruDeath) {
      return roleId === "patrick"
        ? "梅露露死后，后面的相遇只会更短，也更硬。"
        : "梅露露死后，任何一句“冷静一点”都像在案发现场贴纸花。接下来的相遇只会更短、更硬。";
    }
    if (slotId === STORY_ANCHORS.finalVote) {
      return "票纸已经写下。下一步不再是争辩，而是公开每个人真正交出去的名字。";
    }
    if (slotId === VOTE_REVEAL_SLOT) {
      return state.exiledByVote
        ? "票型公开后，你已经被排除在第五小时之外。"
        : `投票结果已经把队伍撕开。${state.voteDeaths.length ? `${state.voteDeaths.map((id) => ENTITIES[id]?.short || id).join(" / ")}的死亡` : "这场放逐"}会直接改写后面的相遇顺序。`;
    }
    if (slotId === STORY_ANCHORS.patrickAwakening) {
      return roleId === "patrick"
        ? "你已经不可能回到完全的人类视角。之后的选择会更多地决定，你是否还愿意替门外的人留下余地。"
        : "派翠克觉醒之后，之前建立的信任和怨恨都会在追逐里变成最直接的目标排序。";
    }
    if (intent.tags.includes("rest")) {
      return roleId === "patrick"
        ? "你刚才停下来的那点时间里，别处已经先把话说完了。"
        : "你刚才停下来的时间里，别处有人先一步拿到了话语权。下一时段开始时，这份落后会很明显。";
    }
    if (effects.flags.patrickBond) {
      return roleId === "patrick"
        ? "你已经把某个人也牵进了自己的终局。"
        : "你与派翠克之间的那条线已经真正出现。之后她会更记得你，也更可能把你卷进她的终局。";
    }
    if (effects.flags.emilyProtected) {
      return "艾米莉开始把你当成可以追着跑的人。保护她会改变终局，也会改变你自己最后站在门前时的速度。";
    }
    if (effects.flags.karlExposed) {
      return "卡尔看你的目光已经不再像试探，而更像记恨。投票前的任何重逢，都可能因此变成真正的冲撞。";
    }
    return "这次行动留下的回响还没有散。下一时段开始时，你会更清楚谁因为你而靠近，谁又因为你而改了路线。";
  }

  function buildEffectChips(effects) {
    const chips = [];
    const pushStat = (label, value) => {
      if (!value) return;
      chips.push(`${label} ${value > 0 ? `+${value}` : value}`);
    };
    pushStat("HP", effects.stats.hp);
    pushStat("MP", effects.stats.mp);
    pushStat("SAN", effects.stats.san);
    pushStat("真相", effects.stats.truth);
    if (effects.generatorGain) chips.push(`${effects.generatorKind === "support" ? "协助供电" : effects.generatorGain >= 1 ? "供电推进" : "发电机"} +${effects.generatorGain}`);
    if (effects.notes.some((note) => note.includes("补救推进") || note.includes("补救发电机"))) chips.push("补救推进");
    if (effects.notes.some((note) => note.includes("错过"))) chips.push("错过推进");
    if (effects.notes.some((note) => note.includes("白门条件仍不足"))) chips.push("白门不足");
    if (effects.notes.some((note) => note.includes("只摸到了部分线索") || note.includes("只拿到部分密码"))) chips.push("部分密码");
    if (effects.notes.some((note) => note.includes("票向") || note.includes("票型") || note.includes("跟票"))) chips.push("票向变化");
    effects.addWords.forEach((word) => chips.push(`密码 ${word}`));
    effects.addClues.forEach((clue) => chips.push(`线索：${clue}`));
    Object.entries(effects.relations).forEach(([key, delta]) => {
      chips.push(`${ENTITIES[key].short}${delta > 0 ? `关系 +${delta}` : `关系 ${delta}`}`);
    });
    Object.entries(effects.relationEchoes || {}).forEach(([key, delta]) => {
      chips.push(`${ENTITIES[key].short}${delta > 0 ? `旁观 +${delta}` : `旁观 ${delta}`}`);
    });
    return chips;
  }

  function getVoteMomentum(effects = {}) {
    const notes = effects.notes || [];
    const relationValues = Object.values(effects.relations || {}).map((value) => Number(value || 0));
    const echoValues = Object.values(effects.relationEchoes || {}).map((value) => Number(value || 0));
    const relationLoss = relationValues.some((delta) => delta <= -8);
    const relationGain = relationValues.some((delta) => delta >= 8);
    const witnessLoss = echoValues.some((delta) => delta <= -3);
    const witnessGain = echoValues.some((delta) => delta >= 3);
    const hasVoteLock = notes.some((note) => note.includes("票向从这一刻开始被正式锁定"))
      || notes.some((note) => note.includes("票型已经开始按这个方向收束"));
    if (relationLoss || witnessLoss) return "worsen";
    if (relationGain || witnessGain) return "improve";
    if (hasVoteLock) return "lock";
    return "none";
  }

  function buildEffectReasonSummary(effects) {
    const reasons = [];
    if (effects.generatorGain > 0) reasons.push(effects.generatorKind === "support" ? "你抓住了协助供电的机会，所以主线条件前进了。" : "你把时间投进了供电推进，所以主线条件前进了。");
    if (effects.notes.some((note) => note.includes("只摸到了部分线索") || note.includes("只拿到部分密码"))) {
      reasons.push("你确实推进了系统目标，但这一步只带回了部分密码，后面仍要继续补足。");
    }
    if (effects.notes.some((note) => note.includes("补救推进") || note.includes("补救发电机"))) {
      reasons.push("你抓住了偏支里的补救机会，才没有把供电进度完全丢掉。");
    }
    if (effects.notes.some((note) => note.includes("错过了本时段最直接的供电推进"))) reasons.push("你绕开了本时段最直接的系统推进，后面补进度会更吃紧。");
    if (effects.notes.some((note) => note.includes("白门条件仍不足"))) reasons.push("你已经推进到终局门前，但供电仍不够，白门不会因为愿望自动打开。");
    if (effects.stats.hp < 0) reasons.push("你选择了承受正面风险，因此体力被明显削掉。");
    if (effects.stats.san < 0) reasons.push("你接触了更危险的信息或局面，所以理智先替你付了代价。");
    if (effects.stats.truth > 0) reasons.push("你换到了更深一层的线索，真相进度因此上升。");
    const relationLoss = Object.values(effects.relations || {}).some((delta) => delta <= -8);
    const relationGain = Object.values(effects.relations || {}).some((delta) => delta >= 8);
    const witnessLoss = Object.values(effects.relationEchoes || {}).some((delta) => delta <= -3);
    const witnessGain = Object.values(effects.relationEchoes || {}).some((delta) => delta >= 3);
    const voteMomentum = getVoteMomentum(effects);
    if (relationLoss) reasons.push("你的态度过硬，至少有一个人的票向开始远离你。");
    if (relationGain) reasons.push("你明确站队或替人分担风险，因此信任被拉高。");
    if (witnessLoss) reasons.push("旁观者也记住了你的公开施压，这会继续恶化后面的站位与票向。");
    if (witnessGain) reasons.push("你的公开站队被其他人看在眼里，跟票与靠拢的可能一起升高。");
    if (voteMomentum === "worsen") reasons.push("这一步已经在把之后的票向往对你不利的方向推。");
    if (voteMomentum === "improve") reasons.push("这一步已经在把之后的票向往你想要的方向拉。");
    if (voteMomentum === "lock") reasons.push("这一步已经把投票结构正式锁定，后面不会再只是气氛描写。");
    if (effects.notes.some((note) => note.includes("错过")) && !effects.notes.some((note) => note.includes("错过了本时段最直接的供电推进"))) {
      reasons.push("你把这一段留给了恢复，也因此错过了别处更早冒头的机会。");
    }
    return reasons.slice(0, 3);
  }

  function buildEffectBreakdown(effects) {
    const costs = [];
    const gains = [];
    const risks = [];
    const pushDelta = (bucket, label, value) => {
      if (!value) return;
      bucket.push(`${label} ${value > 0 ? `+${value}` : value}`);
    };

    pushDelta(costs, "行动力", effects.stats.mp < 0 ? effects.stats.mp : 0);
    pushDelta(costs, "HP", effects.stats.hp < 0 ? effects.stats.hp : 0);
    pushDelta(costs, "SAN", effects.stats.san < 0 ? effects.stats.san : 0);

    pushDelta(gains, "HP", effects.stats.hp > 0 ? effects.stats.hp : 0);
    pushDelta(gains, "SAN", effects.stats.san > 0 ? effects.stats.san : 0);
    pushDelta(gains, "真相", effects.stats.truth > 0 ? effects.stats.truth : 0);

    if (effects.generatorGain > 0) gains.push(`发电机 +${effects.generatorGain}`);
    if (effects.notes.some((note) => note.includes("只摸到了部分线索") || note.includes("只拿到部分密码"))) gains.push("只拿到部分密码");
    if (effects.notes.some((note) => note.includes("补救推进") || note.includes("补救发电机"))) gains.push("补救推进命中");
    if (effects.addWords?.length) gains.push(`密码词 ${effects.addWords.join(" / ")}`);
    if (effects.addClues?.length) gains.push(`线索 ${effects.addClues.slice(0, 2).join(" / ")}`);
    if (effects.addItems?.length) gains.push(`物品 ${effects.addItems.slice(0, 2).join(" / ")}`);

    Object.entries(effects.relations || {}).forEach(([key, delta]) => {
      const label = `${ENTITIES[key]?.short || key}关系`;
      if (delta > 0) gains.push(`${label} +${delta}`);
      if (delta < 0) risks.push(`${label} ${delta}`);
    });
    Object.entries(effects.relationEchoes || {}).forEach(([key, delta]) => {
      const label = `${ENTITIES[key]?.short || key}旁观`;
      if (delta > 0) gains.push(`${label} +${delta}`);
      if (delta < 0) risks.push(`${label} ${delta}`);
    });

    if (effects.notes.some((note) => note.includes("错过了本时段最直接的供电推进"))) {
      risks.push("错过主线发电机");
    } else if (effects.notes.some((note) => note.includes("错过"))) {
      risks.push("错过了本时段机会");
    }
    if (effects.notes.some((note) => note.includes("白门条件仍不足"))) risks.push("白门条件仍不足");
    if (effects.notes.some((note) => note.includes("只摸到了部分线索") || note.includes("只拿到部分密码"))) risks.push("密码仍未齐");
    const voteMomentum = getVoteMomentum(effects);
    if (voteMomentum === "worsen") risks.push("票向开始恶化");
    if (voteMomentum === "improve") gains.push("跟票意愿上升");
    if (voteMomentum === "lock") risks.push("票型已经锁定");

    return {
      costs: [...new Set(costs)],
      gains: [...new Set(gains)],
      risks: [...new Set(risks)],
    };
  }

  function renderEffectBreakdown(breakdown) {
    const sections = [
      { key: "costs", title: "付出了什么", empty: "暂无直接损失" },
      { key: "gains", title: "换到了什么", empty: "暂无直接收益" },
      { key: "risks", title: "留下了什么", empty: "暂无额外后患" },
    ];
    return `
      <div class="result-breakdown">
        ${sections.map(({ key, title, empty }) => {
          const items = breakdown[key] || [];
          return `
            <div class="result-break-card ${key}">
              <strong>${title}</strong>
              ${items.length
                ? `<div class="tag-row">${items.map((item) => `<span class="small-pill">${escapeHtml(item)}</span>`).join("")}</div>`
                : `<span class="result-break-empty">${empty}</span>`}
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderAnjieCompactResultSummary(breakdown = { costs: [], gains: [], risks: [] }, warnings = []) {
    const rows = [];
    const pushRow = (label, items, limit = 1) => {
      const normalized = (items || []).filter(Boolean).slice(0, limit);
      if (!normalized.length) return;
      rows.push({
        label,
        text: normalized.join(" / "),
      });
    };
    pushRow("代价", breakdown.costs, 1);
    pushRow("收获", breakdown.gains, 1);
    pushRow("余波", breakdown.risks, 1);
    pushRow("下一步", warnings, 1);
    if (!rows.length) return "";
    return rows
      .slice(0, 3)
      .map((row) => `${row.label}：${row.text}`)
      .join("；");
  }

  function renderCompactRouteResultSummary(breakdown = { costs: [], gains: [], risks: [] }, warnings = [], reasons = []) {
    const cards = [];
    const pushCard = (label, items, limit = 2) => {
      const normalized = (items || []).filter(Boolean).slice(0, limit);
      if (!normalized.length) return;
      cards.push({
        label,
        text: normalized.join(" / "),
      });
    };
    pushCard("代价", breakdown.costs, 2);
    pushCard("收获", breakdown.gains, 2);
    pushCard("余波", breakdown.risks, 2);
    pushCard("下一步", warnings, 1);
    if (cards.length < 4) {
      pushCard("变化", reasons, 1);
    }
    if (!cards.length) return "";
    return `
      <div class="compact-result-grid">
        ${cards.slice(0, 4).map((item) => `
          <div class="compact-result-item">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.text)}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildOutcomeSignals(effects = {}, currentState = state) {
    const signals = [];
    const costs = breakdownArrayLabel(effects, "costs");
    const gains = breakdownArrayLabel(effects, "gains");
    const risks = breakdownArrayLabel(effects, "risks");
    const voteMomentum = getVoteMomentum(effects);
    if (costs.length) {
      signals.push({ tone: "cost", label: "为什么扣了", text: costs.join("，") });
    }
    if (gains.length) {
      signals.push({ tone: "gain", label: "换来了什么", text: gains.join("，") });
    }
    if (risks.length) {
      signals.push({ tone: "risk", label: "留下了什么", text: risks.join("，") });
    }
    if (voteMomentum === "worsen") {
      signals.push({ tone: "risk", label: "后续票向", text: "这一步会把之后的投票结构往对你不利的方向推。"} );
    } else if (voteMomentum === "improve") {
      signals.push({ tone: "gain", label: "后续票向", text: "这一步会抬高跟票与靠拢的可能，之后更容易形成你想要的站位。"} );
    } else if (voteMomentum === "lock") {
      signals.push({ tone: "neutral", label: "后续票向", text: "这一步已经把票型锁定，4.5 公布时不会再只是气氛变化。"} );
    }
    if (isHeavyInjury(currentState)) {
      signals.push({ tone: "risk", label: "身体状态", text: "你已经处于重伤区间，之后需要体能的动作会持续被锁。"} );
    }
    if (getSanState(currentState) === "truth") {
      signals.push({ tone: "risk", label: "精神状态", text: `你已经看见真实，当前真相层级为 ${getTruthTierLabel(currentState.stats.truth)}。`} );
    } else if (getSanState(currentState) === "insight") {
      signals.push({ tone: "risk", label: "精神状态", text: "异常描写会继续渗进你的观察与判断。"} );
    }
    if (effects.notes.some((note) => note.includes("只摸到了部分线索") || note.includes("只拿到部分密码"))) {
      signals.push({ tone: "neutral", label: "主线完成度", text: "你只拿到了部分密码。供电虽有推进，但白门条件还没有被完整拼好。"} );
    }
    return signals.slice(0, 4);
  }

  function breakdownArrayLabel(effects = {}, key) {
    const breakdown = buildEffectBreakdown(effects);
    return breakdown[key] || [];
  }

  function renderOutcomeSignals(signals = []) {
    if (!signals.length) return "";
    return `
      <div class="outcome-signals">
        ${signals.map((item) => `
          <div class="outcome-signal ${item.tone}">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.text)}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function buildNextStepWarnings(effects = {}, currentState = state) {
    const warnings = [];
    const breakdown = buildEffectBreakdown(effects);
    const voteMomentum = getVoteMomentum(effects);
    if ((breakdown.risks || []).includes("错过主线发电机")) {
      warnings.push("下一时段如果还不补推进，发电机 4 / 4 会明显变得更难。");
    }
    if ((breakdown.risks || []).includes("白门条件仍不足")) {
      warnings.push("你已经靠近终局，但供电条件还不够，白门不会自己打开。");
    }
    if ((breakdown.risks || []).includes("密码仍未齐")) {
      warnings.push("你手里的密码还不完整，之后若不继续补齐，4 / 4 也可能只是假性接近。");
    }
    if (voteMomentum === "worsen") {
      warnings.push("之后再遇到公开场合时，你会更容易被推向不利票型。");
    } else if (voteMomentum === "improve") {
      warnings.push("之后进入投票或公开对峙时，别人更可能向你靠拢。");
    } else if (voteMomentum === "lock") {
      warnings.push("4.5 公布时，这一步的立场会直接反映在票型上。");
    }
    if (isHeavyInjury(currentState)) {
      warnings.push("重伤会持续锁住需要奔跑、冲撞、攀爬或正面攻击的动作。");
    }
    if (currentState.stats.mp <= 0) {
      warnings.push("你下一步几乎只剩休息或极少数低成本选择。");
    }
    if (getSanState(currentState) === "truth") {
      warnings.push("你已经看见真实，继续硬吃信息时更容易直接滑向 SAN 归零。");
    } else if (getSanState(currentState) === "insight") {
      warnings.push("异常描写会继续变重，错误路径更容易把你推向低 SAN 区。");
    }
    return [...new Set(warnings)].slice(0, 3);
  }

  function renderNextStepWarnings(warnings = []) {
    if (!warnings.length) return "";
    return `
      <div class="next-step-box">
        <strong>下一时段会怎样</strong>
        <div class="next-step-list">
          ${warnings.map((item) => `<span class="small-pill">${escapeHtml(item)}</span>`).join("")}
        </div>
      </div>
    `;
  }

  function getAverageRelation(currentState = state) {
    const values = Object.entries(currentState.relations || {})
      .filter(([id]) => ENTITIES[id] && id !== currentState.selectedRole)
      .map(([, value]) => Number(value || 0));
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function isSacrificeChoice(currentState = state) {
    const lastOption = currentState.route?.[currentState.route.length - 1]?.optionLabel || "";
    const finalChoice = String(currentState.keyChoices?.final_choice || "");
    const optionText = String(lastOption || "");
    return /sacrifice/i.test(finalChoice)
      || /leave|stay|hold|block|sacrifice/i.test(optionText)
      || /牺牲|献身|留下|留在|断后|挡住|守住|拖住|先走|我留在这里|替.*挡|成为噩梦/.test(optionText);
  }

  function routeEntries(currentState = state) {
    return Array.isArray(currentState.route) ? currentState.route : [];
  }

  function countRouteMatches(currentState, matcher) {
    if (typeof matcher !== "function") return 0;
    return routeEntries(currentState).filter((entry) => matcher(entry || {})).length;
  }

  function optionTextOf(entry = {}) {
    return String(entry.optionLabel || entry.label || entry.optionKey || "");
  }

  function countRouteOptionsByText(currentState, pattern) {
    const regex = pattern instanceof RegExp ? pattern : new RegExp(String(pattern || ""), "i");
    return countRouteMatches(currentState, (entry) => regex.test(optionTextOf(entry)) || regex.test(String(entry.slotId || "")));
  }

  function truthScore(value) {
    const truth = Number(value || 0);
    if (truth >= 76) return 3;
    if (truth >= 68) return 2;
    if (truth >= 58) return 1;
    return 0;
  }

  function relationScore(value, high = 14, mid = 10, low = 6) {
    const relation = Number(value || 0);
    if (relation >= high) return 3;
    if (relation >= mid) return 2;
    if (relation >= low) return 1;
    return 0;
  }

  function sanityScore(value) {
    const san = Number(value || 0);
    if (san >= 40) return 2;
    if (san >= 34) return 1;
    return 0;
  }

  function bodyScore(currentState = state) {
    const hp = Number(currentState.stats?.hp || 0);
    if (!isHeavyInjury(currentState)) return hp >= 7 ? 2 : 1;
    return 0;
  }

  function getRouteMilestoneScore(roleId, currentState = state) {
    const flags = currentState.flags || {};
    const truth = Number(currentState.stats?.truth || 0);
    const generators = Number(currentState.generators?.progress || 0);
    const clues = Array.isArray(currentState.clues) ? currentState.clues.length : 0;
    const routeCount = routeEntries(currentState).length;
    const evidenceChoices = countRouteOptionsByText(currentState, /truth|clue|proof|evidence|record|note|file|investigate|observe|protect|promise|mercy|expose|repair|generator|真相|线索|证据|记录|笔记|档案|调查|观察|保护|约定|安息|揭露|发电机|修理/);
    let score = 0;
    if (generators >= 4) score += 1;
    if (truth >= 51) score += 1;
    if (truth >= 68) score += 1;
    if (clues >= 4) score += 1;
    if (routeCount >= 8) score += 1;
    if (evidenceChoices >= 2) score += 1;
    if (flags.karlExposed) score += Math.min(2, Number(flags.karlExposed || 0));
    if (flags.emilyProtected) score += roleId === "yamada" ? 2 : 1;
    if (flags.patrickBond) score += roleId === "anjie" || roleId === "patrick" ? 2 : 1;
    if (flags.patrickMercy) score += roleId === "patrick" ? 3 : 1;
    if (flags.patrickAwakened) score += roleId === "patrick" ? 1 : 0;
    if (flags.meruruBlessing) score += roleId === "fan" ? 2 : 1;
    return score;
  }

  function evaluateCanonScore(roleId = state.selectedRole, currentState = state) {
    const relationValues = Object.entries(currentState.relations || {})
      .filter(([id]) => ENTITIES[id] && id !== roleId)
      .map(([, value]) => Number(value || 0));
    const positiveRelations = relationValues.filter((value) => value >= 6).length;
    const severeEnemies = relationValues.filter((value) => value <= -16).length;
    const routeCount = routeEntries(currentState).length;
    const generators = Number(currentState.generators?.progress || 0);
    const truth = Number(currentState.stats?.truth || 0);
    const san = Number(currentState.stats?.san || 0);
    const hp = Number(currentState.stats?.hp || 0);
    let score = 0;
    if (generators >= 4) score += 2;
    else if (generators >= 3) score += 1;
    if (truth >= 60) score += 2;
    else if (truth >= 45) score += 1;
    if (san >= 34) score += 1;
    if (hp >= 6) score += 1;
    if (positiveRelations >= 2) score += 1;
    if (severeEnemies === 0) score += 1;
    if (routeCount >= 8) score += 1;
    score += Math.min(3, getRouteMilestoneScore(roleId, currentState));
    return score;
  }

  function evaluateEndingScore(roleId = state.selectedRole, currentState = state) {
    const flags = currentState.flags || {};
    const relations = currentState.relations || {};
    const stats = currentState.stats || {};
    const escaped = Number(currentState.generators?.progress || 0) >= 4;
    const sacrifice = isSacrificeChoice(currentState);
    const hp = Number(stats.hp || 0);
    const san = Number(stats.san || 0);
    const truth = Number(stats.truth || 0);
    const averageRelation = getAverageRelation(currentState);
    const milestone = getRouteMilestoneScore(roleId, currentState);
    const canon = evaluateCanonScore(roleId, currentState);
    const base = {
      roleId,
      escaped,
      sacrifice,
      truth,
      san,
      hp,
      heavyInjury: isHeavyInjury(currentState),
      averageRelation,
      milestone,
      canon,
      scores: {},
      reasons: [],
    };
    const addReason = (label, value) => base.reasons.push({ label, value });
    if (roleId === "fan") {
      const score = (sacrifice ? 4 : 0) + truthScore(truth) + sanityScore(san) + Math.min(3, milestone) + (flags.meruruBlessing ? 2 : 0);
      base.scores.fan_absolution = score;
      addReason("牺牲意愿", sacrifice ? "成立" : "未选择");
      addReason("真相与理智", `真相 ${truth} / SAN ${san}`);
      base.specialKey = score >= 8 ? "special.fan_absolution" : "";
    } else if (roleId === "ziche") {
      const score = (escaped ? 3 : 0) + (hp >= 7 ? 2 : hp >= 6 ? 1 : 0) + (averageRelation <= 0 ? 2 : averageRelation <= 2 ? 1 : 0) + Math.min(3, milestone) + (!sacrifice ? 1 : 0);
      base.scores.ziche_lone_exit = score;
      addReason("独行倾向", `平均关系 ${averageRelation.toFixed(1)}`);
      addReason("体能", `HP ${hp}`);
      base.specialKey = score >= 8 ? "special.ziche_lone_exit" : "";
    } else if (roleId === "yamada") {
      const emily = Number(relations.emily || 0);
      const score = (escaped ? 3 : 0) + (flags.emilyProtected ? 3 : 0) + relationScore(emily, 14, 10, 6) + Math.min(3, milestone);
      base.scores.yamada_emily_promise = score;
      addReason("艾米莉", `关系 ${emily}${flags.emilyProtected ? " / 已保护" : ""}`);
      base.specialKey = score >= 8 ? "special.yamada_emily_promise" : "";
    } else if (roleId === "anjie") {
      const patrick = Number(relations.patrick || 0);
      const score = (escaped ? 1 : 0) + truthScore(truth) + relationScore(patrick, 14, 10, 6) + sanityScore(san) + bodyScore(currentState) + Math.min(3, milestone) + (flags.patrickBond ? 1 : 0);
      base.scores.anjie_proof = score;
      addReason("证明链", `真相 ${truth} / 里程碑 ${milestone}`);
      addReason("派翠克信任", `关系 ${patrick}${flags.patrickBond ? " / 共同经历" : ""}`);
      addReason("稳定度", `HP ${hp} / SAN ${san}`);
      base.specialKey = escaped && score >= 9 ? "special.anjie_proof" : "";
    } else if (roleId === "debora") {
      const exposed = Number(flags.karlExposed || 0);
      const score = (escaped ? 3 : 0) + (exposed >= 2 ? 3 : exposed >= 1 ? 2 : 0) + truthScore(truth) + Math.min(3, milestone);
      base.scores.debora_old_debt = score;
      addReason("卡尔旧债", `揭露 ${exposed} / 真相 ${truth}`);
      base.specialKey = score >= 8 ? "special.debora_old_debt" : "";
    } else if (roleId === "patrick") {
      const anjie = Number(relations.anjie || 0);
      const score = (flags.patrickMercy ? 4 : 0) + relationScore(anjie, 14, 10, 6) + Math.min(3, milestone) + (flags.patrickBond ? 1 : 0) + (flags.patrickAwakened ? 1 : 0);
      base.scores.patrick_rest = score;
      addReason("安息标记", flags.patrickMercy ? "已取得" : "未取得");
      addReason("安洁信任", `关系 ${anjie}`);
      base.specialKey = score >= 8 ? "special.patrick_rest" : "";
    }
    return base;
  }

  function getSpecialEndingKey(currentState = state) {
    const roleId = currentState.selectedRole;
    const score = evaluateEndingScore(roleId, currentState);
    return score.specialKey || "";
  }

  function getOutcomeTypeForKey(key) {
    if (key.startsWith("special.")) return "special";
    if (key === "common.vote_exile") return "vote";
    if (key === "common.dead" || key === "common.sacrifice_failed_body") return "dead";
    if (key === "common.mad") return "mad";
    if (key === "common.sacrifice") return "sacrifice";
    if (key === "common.loop_low_truth" || key === "common.loop_wounded" || key === "common.loop_unstable") return "loop";
    if (key === "common.escape") return "escape";
    return "lost";
  }

  function getCommonEndingText(roleId, key) {
    const roleText = ENDING_PROFILES.roles?.[roleId]?.[key];
    if (roleText) return roleText;
    const role = ROLE_DEFS[roleId] || currentRole();
    if (key === "common.sacrifice") return role?.endingNotes?.sacrifice || "";
    if (key === "common.escape") return role?.endingNotes?.escape || "";
    return role?.endingNotes?.lost || "";
  }

  function createOutcome(currentState, key, extra = {}) {
    const roleId = currentState.selectedRole || FALLBACK_ROLE_ID;
    const role = ROLE_DEFS[roleId] || currentRole();
    const specialEntry = key.startsWith("special.")
      ? Object.values(ENDING_PROFILES.special || {}).find((entry) => entry.key === key)
      : null;
    const commonEntry = ENDING_PROFILES.common?.[key] || {};
    const scope = key.startsWith("special.") ? "special" : "common";
    const baseTitle = specialEntry?.title || commonEntry.title || "结局";
    const outcome = {
      key,
      type: getOutcomeTypeForKey(key),
      scope,
      roleId,
      title: extra.title || baseTitle,
      text: extra.text || specialEntry?.text || getCommonEndingText(roleId, key),
      note: extra.note || specialEntry?.note || commonEntry.note || "",
      checks: [],
    };
    outcome.checks = buildEndingChecks(currentState, outcome);
    return outcome;
  }

  function buildEndingChecks(currentState = state, outcome = currentState.outcome || determineOutcome(currentState)) {
    const checks = [];
    const escaped = currentState.generators.progress >= 4;
    const truthReady = currentState.stats.truth >= 76;
    const heavy = isHeavyInjury(currentState);
    const saneEnough = currentState.stats.san >= 40;
    checks.push({
      tone: escaped ? "pass" : "fail",
      label: "开门条件",
      text: escaped ? `发电机 ${currentState.generators.progress} / 4，白门具备开启条件。` : `发电机仅 ${currentState.generators.progress} / 4，物理逃生条件不足。`,
    });
    checks.push({
      tone: truthReady ? "pass" : "fail",
      label: "真相层级",
      text: `真相 ${currentState.stats.truth} / ${getTruthTierLabel(currentState.stats.truth)}。`,
    });
    checks.push({
      tone: heavy ? "fail" : "pass",
      label: "身体状态",
      text: heavy ? "当前处于重伤，体能型或牺牲型结局会受阻。" : "身体状态没有阻断终局选择。",
    });
    checks.push({
      tone: saneEnough ? "pass" : "fail",
      label: "理智状态",
      text: saneEnough ? "理智仍能支撑终局判断。" : "理智不足，真相或牺牲会被扭曲。",
    });
    checks.push({
      tone: currentState.exiledByVote ? "fail" : "pass",
      label: "投票结果",
      text: currentState.exiledByVote
        ? "你在票型公开阶段被放逐。"
        : currentState.voteDeaths.length
          ? `被放逐：${currentState.voteDeaths.map((id) => ENTITIES[id]?.short || id).join(" / ")}。`
          : "本轮没有投票放逐记录。",
    });
    checks.push({
      tone: outcome?.scope === "special" ? "pass" : "fail",
      label: outcome?.scope === "special" ? "个人特殊结局" : "结局类型",
      text: outcome?.scope === "special" ? `${outcome.title}：${outcome.note}` : `${outcome.title}：${outcome.note || outcome.key}`,
    });
    return checks.slice(0, 6);
  }

  function renderEndingChecks(checks = []) {
    if (!checks.length) return "";
    return `
      <div class="ending-checks">
        ${checks.map((item) => `
          <div class="ending-check ${item.tone}">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.text)}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function listEndingGalleryEntries(roleId) {
    const commonKeys = Object.keys(ENDING_PROFILES.common || {});
    const specialEntries = Object.values(ENDING_PROFILES.special || {}).filter((entry) => entry?.key?.startsWith(`special.${roleId}_`));
    return [
      ...commonKeys.map((key) => ({ key, scope: "common" })),
      ...specialEntries.map((entry) => ({ key: entry.key, scope: "special" })),
    ];
  }

  function getEndingConditionText(roleId, endingKey) {
    const common = {
      "common.vote_exile": "投票公开时主角成为最高票，或平票名单包含主角。关系权重会影响票型，但极端敌意仍可能锁票。",
      "common.dead": "路线结束前 HP 降至 0。通常来自连续冒险、受伤后继续硬闯或错过补救。",
      "common.mad": "路线结束前 SAN 降至 0。高真相会带来精神代价，但休整和线索复盘可以缓冲。",
      "common.trapped": "进入终局时发电机进度不足 4。至少需要持续推进物理逃生，不能只追逐真相。",
      "common.sacrifice_failed_body": "最终选择牺牲，但身体状态不足。若角色里程碑足够，部分路线可避免被单一体能值锁死。",
      "common.sacrifice_failed_sanity": "最终选择牺牲，但精神状态不足。休整、信任和关键证据可以降低失败风险。",
      "common.sacrifice": "最终选择牺牲，且身体、理智或角色里程碑足以支撑断后。",
      "common.loop_low_truth": "发电机进度达到 4，但真相理解不足。v1.2 后，角色直觉和关键证据可补足一部分真相差距。",
      "common.loop_wounded": "发电机进度达到 4、真相接近完整，但重伤拖住结局。足够的原作倾向选择可进入保底好结局。",
      "common.loop_unstable": "发电机进度达到 4、真相接近完整，但 SAN 过低。足够的信任、证据和休整可补足。",
      "common.escape": "发电机进度达到 4，并且真相、状态、关系或角色直觉评分足以支撑普通好结局。",
    };
    const special = {
      fan: "综合判定：牺牲意愿、真相理解、SAN 稳定、梅露露相关里程碑与角色直觉。高真相高 SAN 可直达，也可用关键选择补足。",
      ziche: "综合判定：发电机完成、体能、独行倾向、未选择牺牲与路线里程碑。HP 略低或平均关系略高时，可由自立选择补足。",
      yamada: "综合判定：发电机完成、艾米莉保护、艾米莉关系与共同经历。关系不足时，保护和承诺类选择可以补分。",
      anjie: "综合判定：真相、派翠克信任、关键证据、SAN 稳定、未重伤与共同经历。高数值可直达，也允许证据或共同经历补足短板。",
      debora: "综合判定：发电机完成、揭露卡尔、真相理解与旧债证据。揭露次数不足时，证据链和真相推进可补分。",
      patrick: "综合判定：安息标记、安洁信任、派翠克觉醒/羁绊与路线里程碑。关系略低时，共同经历可补足。",
    };
    if (common[endingKey]) return common[endingKey];
    if (String(endingKey || "").startsWith("special.")) return special[roleId] || "满足该角色个人特殊结局的综合评分：数值、证据、关系与关键选择共同判定。";
    return "满足该结局的对应判定条件。";
  }

  function hasSeenEndingKey(roleId, endingKey) {
    const meta = loadMeta();
    return (meta.endingKeysSeen || []).includes(endingKey) || state.outcome?.roleId === roleId && state.outcome?.key === endingKey;
  }

  function getEndingGalleryEntry(roleId, endingKey) {
    const role = ROLE_DEFS[roleId] || {};
    const specialEntry = endingKey?.startsWith("special.")
      ? Object.values(ENDING_PROFILES.special || {}).find((entry) => entry.key === endingKey)
      : null;
    const commonEntry = ENDING_PROFILES.common?.[endingKey] || {};
    const title = specialEntry?.title || commonEntry.title || "\u672a\u547d\u540d\u7ed3\u5c40";
    const note = specialEntry?.note || commonEntry.note || endingKey || "";
    const text = specialEntry?.text || ENDING_PROFILES.roles?.[roleId]?.[endingKey] || role.endingNotes?.lost || "\u8be5\u7ed3\u5c40\u6587\u6848\u5c1a\u672a\u914d\u7f6e\u3002";
    return {
      key: endingKey,
      title,
      note,
      text,
      condition: getEndingConditionText(roleId, endingKey),
      scope: endingKey?.startsWith("special.") ? "\u4e2a\u4eba\u7279\u6b8a\u7ed3\u5c40" : "\u901a\u7528\u7ed3\u5c40",
    };
  }

  function renderEndingGallery(roleId) {
    const entries = listEndingGalleryEntries(roleId);
    if (!entries.length) return "";
    const selectedKey = state.galleryEnding?.roleId === roleId ? state.galleryEnding.key : entries[0].key;
    const selected = getEndingGalleryEntry(roleId, selectedKey);
    return `
      <section class="ending-gallery">
        <div class="panel-headline">\u7ed3\u5c40\u56fe\u9274</div>
        <div class="ending-gallery-buttons">
          ${entries.map(({ key }) => {
            const item = getEndingGalleryEntry(roleId, key);
            const seen = hasSeenEndingKey(roleId, key);
            return `<button class="small-pill ending-gallery-button ${key === selectedKey ? "active" : ""} ${seen ? "seen" : ""}" data-action="view-ending-gallery" data-role="${roleId}" data-ending="${escapeHtml(key)}">${escapeHtml(item.title)}</button>`;
          }).join("")}
        </div>
        <article class="ending-gallery-detail">
          <div class="archive-meta">${escapeHtml(selected.scope)} \u00b7 ${escapeHtml(selected.note)}</div>
          <h3>${escapeHtml(selected.title)}</h3>
          <p>${escapeHtml(selected.text)}</p>
          <div class="detail-line"><strong>\u5224\u5b9a\u6761\u4ef6</strong><span>${escapeHtml(selected.condition)}</span></div>
        </article>
      </section>
    `;
  }

  const UNDO_STATE_KEYS = [
    "slotIndex",
    "phase",
    "scene",
    "scenePage",
    "stats",
    "generators",
    "relations",
    "suspicion",
    "visits",
    "clues",
    "items",
    "keyChoices",
    "alliances",
    "npcPositions",
    "playerPosition",
    "deadEntities",
    "voteLedger",
    "voteTally",
    "voteDeaths",
    "exiledByVote",
    "flags",
    "route",
    "log",
    "notice",
    "finished",
    "outcome",
  ];

  function createUndoSnapshot(currentState = state) {
    const snapshot = {};
    UNDO_STATE_KEYS.forEach((key) => {
      snapshot[key] = structuredClone(currentState[key]);
    });
    return snapshot;
  }

  function restoreUndoSnapshot(snapshot) {
    if (!snapshot) return false;
    UNDO_STATE_KEYS.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(snapshot, key)) {
        state[key] = structuredClone(snapshot[key]);
      }
    });
    state.screen = "game";
    state.overlay = null;
    state.phase = "decision";
    state.scene = null;
    state.scenePage = 0;
    state.finished = false;
    state.outcome = null;
    state.autosave = true;
    state.notice = state.notice || "已撤回到上一时段选择前。";
    state = normalizeState(state);
    return true;
  }

  function undoLastChoice() {
    if (state.screen !== "game" || !Array.isArray(state.undoStack) || !state.undoStack.length) return;
    const nextStack = state.undoStack.slice(0, -1);
    const snapshot = state.undoStack[state.undoStack.length - 1];
    if (!restoreUndoSnapshot(snapshot)) return;
    state.undoStack = nextStack;
    state.notice = "已撤回上一步选择。";
    persist();
    render();
  }

  function chooseOption(optionKey) {
    const slotId = currentSlotId();
    const role = currentRole();
    const rawLabel = getRoleOptions(role.id, slotId)[optionKey];
    const intent = analyzeChoice(rawLabel, optionKey, slotId, role.id);
    const reason = getOptionDisabledReason(state, slotId, intent);
    if (reason) {
      state.notice = reason;
      persist();
      render();
      return;
    }
    const scene = composeScene(slotId, optionKey);
    if (!scene || !Array.isArray(scene.paragraphs)) {
      state.scene = null;
      state.phase = "decision";
      state.notice = "本时段结果文本缺失，系统已阻止进入异常结果页。请重新选择本时段行动。";
      persist();
      render();
      return;
    }
    const undoSnapshot = createUndoSnapshot(state);
    state.scene = scene;
    state.phase = "result";
    state.scenePage = 0;
    applyEffectsToState(state, scene.effects, scene);
    if (isTerminalFailure(state)) {
      state.notice = isDead(state) ? "你的 HP 已经归零。" : "你的 SAN 已经归零。";
    }
    if (scene.effects.flags.voteOutcome) {
      state.flags.voteOutcome = scene.effects.flags.voteOutcome;
    }
    state.notice = scene.nextNotice;
    state.log.push({
      slotId,
      title: scene.summary,
      optionKey,
      text: scene.paragraphs.join("\n\n"),
    });
    state.route.push({
      slotId,
      optionKey,
      optionLabel: scene.cleanLabel,
      encounter: scene.encounter?.short || "",
      chips: scene.effectChips,
      summary: scene.summary,
    });
    state.undoStack = [...(Array.isArray(state.undoStack) ? state.undoStack : []), undoSnapshot];
    state.autosave = true;
    persist();
    render();
  }

  function continueSlot() {
    const role = currentRole();
    if (state.flags.voteRevealPending && state.slotIndex === SLOT_ORDER.indexOf(STORY_ANCHORS.finalVote) && !state.voteLedger?.player) {
      const vote = resolveVoteLedger(state, state.flags.voteTarget || state.keyChoices.vote_target || "crowd");
      state.voteLedger = vote.ledger;
      state.voteTally = vote.tally;
      state.voteDeaths = vote.deaths;
      state.exiledByVote = vote.exiledByVote;
      state.deadEntities = [...new Set([...(state.deadEntities || []), ...vote.deaths.filter((id) => id !== state.selectedRole)])];
      state.flags.voteOutcome = vote.exiledByVote ? "投票放逐" : vote.deaths.map((id) => ENTITIES[id]?.short || id).join(" / ");
      state.flags.voteRevealPending = false;
      state.slotIndex = Math.min(SLOT_ORDER.indexOf(VOTE_REVEAL_SLOT), SLOT_ORDER.length - 1);
      state.notice = vote.exiledByVote
        ? "票型已经公开。你成了最高票者。"
        : `票型已经公开，${vote.deaths.map((id) => ENTITIES[id]?.short || "未知").join(" / ")}被放逐。`;
      state.phase = "decision";
      state.scene = null;
      state.scenePage = 0;
      persist();
      render();
      return;
    }
    if (state.voteLedger?.player && state.slotIndex === SLOT_ORDER.indexOf(VOTE_REVEAL_SLOT)) {
      if (state.exiledByVote) {
        finishRoute();
        return;
      }
      state.slotIndex = Math.min(SLOT_ORDER.indexOf(STORY_ANCHORS.patrickAwakening), SLOT_ORDER.length - 1);
      state.phase = "decision";
      state.scene = null;
      state.scenePage = 0;
      state.overlay = null;
      persist();
      render();
      return;
    }
    if (state.phase === "result" && PAGED_ROUTE_IDS.has(role?.id) && state.scene && Array.isArray(state.scene.paragraphs)) {
      const pages = role.id === "patrick"
        ? getPatrickResultPages(state.scene)
        : role.id === "anjie"
          ? getAnjieResultPages(state.scene)
          : getPagedResultPages(state.scene, role.id);
      const currentPage = clamp(Number(state.scenePage || 0), 0, Math.max(0, pages.length - 1));
      if (pages.length > 1 && currentPage < pages.length - 1) {
        state.scenePage = currentPage + 1;
        persist();
        render();
        return;
      }
    }
    if (isTerminalFailure(state)) {
      finishRoute();
      return;
    }
    if (state.slotIndex >= SLOT_ORDER.length - 1) {
      finishRoute();
      return;
    }
    state.slotIndex += 1;
    state.flags.restUsedSlot = null;
    state.phase = "decision";
    state.scene = null;
    state.scenePage = 0;
    state.overlay = null;
    persist();
    render();
  }

  function finishRoute() {
    state.finished = true;
    state.screen = "end";
    state.overlay = null;
    state.scenePage = 0;
    state.archive[state.selectedRole] = true;
    state.outcome = determineOutcome(state);
    recordRouteCompletion(state.selectedRole, state.outcome);
    state.archive = syncArchiveWithMeta(state.archive);
    persist();
    render();
  }

  function determineOutcome(currentState = state) {
    const sacrifice = isSacrificeChoice(currentState);
    const heavyInjury = isHeavyInjury(currentState);
    const unstableSan = Number(currentState.stats?.san || 0) < 40;
    const escaped = currentState.generators.progress >= 4;
    const endingScore = evaluateEndingScore(currentState.selectedRole, currentState);
    const canonGood = endingScore.canon >= 8;
    const truthReady = Number(currentState.stats?.truth || 0) >= 76 || (canonGood && Number(currentState.stats?.truth || 0) >= 58);
    if (currentState.exiledByVote) return createOutcome(currentState, "common.vote_exile");
    if (isDead(currentState)) return createOutcome(currentState, "common.dead");
    if (isInsane(currentState)) return createOutcome(currentState, "common.mad");
    const specialKey = endingScore.specialKey || getSpecialEndingKey(currentState);
    if (specialKey) return createOutcome(currentState, specialKey);
    if (sacrifice && heavyInjury && !canonGood) return createOutcome(currentState, "common.sacrifice_failed_body");
    if (sacrifice && unstableSan && !canonGood) return createOutcome(currentState, "common.sacrifice_failed_sanity");
    if (sacrifice) return createOutcome(currentState, "common.sacrifice");
    if (!escaped) return createOutcome(currentState, "common.trapped");
    if (!truthReady) return createOutcome(currentState, "common.loop_low_truth");
    if (heavyInjury && !canonGood) return createOutcome(currentState, "common.loop_wounded");
    if (unstableSan && !canonGood) return createOutcome(currentState, "common.loop_unstable");
    return createOutcome(currentState, "common.escape");
  }

  function compressTextByState(text, currentState = state) {
    const normalized = normalizeNarrativeText(text);
    if (!normalized) return "";
    if (isDead(currentState) || isInsane(currentState)) return normalized.length > 70 ? `${normalized.slice(0, 70)}……` : normalized;
    if (isHeavyInjury(currentState)) {
      const sentences = splitNarrativeSentences(normalized);
      let clipped = normalized;
      if (normalized.length > 88) {
        let current = "";
        for (const sentence of sentences) {
          if (!current) {
            current = sentence;
            continue;
          }
          if ((current + sentence).length > 88) break;
          current += sentence;
        }
        clipped = current && current.length <= 88 ? `${current}……` : `${normalized.slice(0, 88)}……`;
      }
      return /剧痛|眩晕|视野模糊/.test(clipped) ? clipped : `剧痛顶上来。${clipped}`;
    }
    return normalized;
  }

  function addStateNarrativeHints(paragraphs, currentState = state) {
    const items = Array.isArray(paragraphs) ? paragraphs.slice() : [];
    const hpState = getHpState(currentState);
    const sanState = getSanState(currentState);
    if (hpState === "heavy") {
      items.splice(1, 0, "剧痛和眩晕压着你的思路，你只能把剩下的话说短。");
    }
    if (Number(currentState?.stats?.san || 0) < SAN_VISUAL_THRESHOLD) {
      items.push("你开始怀疑每一道回声都在提醒你别再看太久。");
    }
    if (sanState === "insight") {
      items.push("墙面像在呼吸，细小的异响正慢慢变得有形。");
    }
    if (sanState === "truth") {
      items.push(`你看见真实，${getTruthTierLabel(currentState.stats.truth)}。`);
    }
    return items.filter(Boolean);
  }

  function relationshipTone(value) {
    return getRelationBandLabel(value);
  }

  function getRelationVoteHint(value = 0) {
    const relation = clamp(Number(value || 0), RELATION_MIN, RELATION_MAX);
    if (relation <= -16) return "会投你";
    if (relation >= 16) return "会跟票";
    return "中立带";
  }

  function getIntentPreviewLines(intent = {}, currentState = state, slotId = currentSlotId()) {
    if (!intent) return [];
    const lines = [];
    const mpCost = Number(intent.mpCost || 0);
    const riskLabel = ACTION_TIER_LABELS[intent.actionTier] || "推进";
    if (intent.tags?.includes("rest")) {
      lines.push(`休息后回满行动力${currentState.maxStats.mp || BASE_MP}。`);
      if (!hasRestedThisSlot(currentState, slotId)) lines.push("会放弃本时段其他推进。");
      return lines;
    }
    if (intent.plannedGeneratorSlot) {
      lines.push(
        intent.generatorOpportunityKind === "fallback"
          ? "这是本路线的补救型供电推进。"
          : intent.generatorOpportunityKind === "support"
            ? "这是协助供电的推进机会。"
            : mpCost >= 2
              ? "这是高投入的主线供电推进。"
              : "这是直接影响供电的主线推进。",
      );
    } else if (intent.tags?.includes("generator")) {
      lines.push("这一步会优先推进发电机或白门条件。");
    } else if (intent.tags?.includes("vote")) {
      lines.push("这一步会提前改变之后的票向。");
    } else if (intent.tags?.includes("attack")) {
      lines.push("这一步会把局面推向正面冲突。");
    } else if (intent.tags?.includes("social") || intent.targets?.length) {
      lines.push("这一步会直接改动至少一人的关系。");
    }
    if (riskLabel === "豪赌") lines.push("失败代价会很重。");
    else if (riskLabel === "推进") lines.push("会换来进度，但要付出代价。");
    else lines.push("收益较稳，但推进较慢。");
    if (isHeavyInjury(currentState) && isPhysicalIntent(intent)) lines.push("你当前重伤，这类动作会被锁定。");
    else if (mpCost >= 2) lines.push("需要预留两点行动力。");
    return lines.slice(0, 2);
  }

  function buildReadableOptionChips(intent = {}, module = null, compactRoute = false) {
    const chips = [];
    if (intent.tags?.includes("rest")) chips.push("休息");
    if (intent.tags?.includes("generator")) chips.push("发电机");
    if (intent.plannedGeneratorSlot) chips.push(intent.generatorOpportunityKind === "fallback" ? "补救推进" : intent.generatorOpportunityKind === "support" ? "协助供电" : "关键推进");
    if (intent.tags?.includes("social")) chips.push("交涉");
    if (intent.tags?.includes("investigate")) chips.push("调查");
    if (intent.tags?.includes("attack")) chips.push("体能");
    if (intent.tags?.includes("vote")) chips.push("票向");
    if (!intent.tags?.includes("rest")) chips.push(`行动力 ${intent.mpCost}`);
    chips.push(ACTION_TIER_LABELS[intent.actionTier] || "推进");
    if (intent.targets?.length) chips.push(`对象 ${intent.targets.map((id) => ENTITIES[id]?.short || id).join(" / ")}`);
    if (!compactRoute && intent.location?.name) chips.push(intent.location.name);
    if (!compactRoute && module?.branchClass) chips.push(describeBranchClass(module.branchClass));
    if (!compactRoute && module?.urgency) chips.push(`紧迫 ${module.urgency}/5`);
    return chips;
  }

  function renderReadableOptionCard(roleId, slotId, key, label) {
    const module = getOptionModule(roleId, slotId, key);
    const intent = analyzeChoice(label, key, slotId, roleId);
    const compactLabel = compactDecisionLabel(roleId, slotId, label, key);
    const compactRoute = COMPACT_RESULT_ROUTE_IDS.has(roleId);
    const reason = getOptionDisabledReason(state, slotId, intent);
    const disabled = !!reason;
    const restedThisSlot = intent.tags.includes("rest") && hasRestedThisSlot(state, slotId);
    const exhausted = state.stats.mp <= 0;
    const previewLines = getIntentPreviewLines(intent, state, slotId);
    const chips = buildReadableOptionChips(intent, module, compactRoute);
    const proseLine = compactRoute ? "" : buildOptionFlavorLine(roleId, slotId, module, intent);
    const focusLabel = compactRoute || !module ? "" : formatFocusLabel(module.focus);
    const topHint = restedThisSlot ? "已休息" : exhausted && intent.tags.includes("rest") ? "唯一可选" : `行动力 ${intent.mpCost}`;
    return `
      <button class="option-card ${disabled ? "disabled" : ""} ${restedThisSlot ? "rest-locked" : ""} ${exhausted && intent.tags.includes("rest") ? "rest-ready" : ""}" data-action="choose-option" data-option="${key}" ${disabled ? "disabled" : ""}>
        <div class="option-top">
          <strong>${key}</strong>
          <span>${topHint}</span>
        </div>
        <p>${compactLabel}</p>
        ${previewLines.length ? `<div class="option-preview">${previewLines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}</div>` : ""}
        ${focusLabel ? `<div class="archive-meta">${focusLabel}</div>` : ""}
        ${proseLine ? `<div class="archive-meta">${proseLine}</div>` : ""}
        ${reason ? `<div class="archive-meta danger">${reason}</div>` : ""}
        ${chips.length ? `<div class="tag-row">${chips.map((chip) => `<span class="small-pill">${chip}</span>`).join("")}</div>` : ""}
      </button>
    `;
  }

  function renderRelationSnapshotItem(entityId) {
    const relation = state.relations?.[entityId] || 0;
    return `
      <div class="relation-item">
        <strong>${ENTITIES[entityId]?.short || entityId}</strong>
        <span>${relationshipTone(relation)} / ${relation}</span>
        <em>${getRelationVoteHint(relation)}</em>
      </div>
    `;
  }

  function render() {
    try {
      app.innerHTML = `
        ${renderMain()}
        ${renderOverlay()}
      `;
      if (state.screen === "truth" && state.truthCollectionId === EPILOGUE_COLLECTION_ID) {
        syncEpilogueAudioUi();
      }
    } catch (error) {
      console.error("[Shepherd] Render failed.", error);
      renderFatal(error, ["当前页面或旧版存档已触发渲染保护，已改为显示错误面板。"]);
    }
  }

  function renderMain() {
    if (state.screen === "title") return renderTitle();
    if (state.screen === "select") return renderSelect();
    if (state.screen === "archive") return renderArchive();
    if (state.screen === "end") return renderEnd();
    if (state.screen === "truth") return renderTruth();
    return renderGame();
  }


  function renderTitle1931Message() {
    return `
      <section class="title-preview-band title-preview-1931" aria-live="polite">
        <div class="title-preview-copy">
          <div class="title-preview-line title-preview-1931-line">致我的妹妹：露西·布莱克，她的笑容停留在1931年</div>
        </div>
      </section>
    `;
  }

  function renderTitleHotspots(roles, viewBox, label = "角色选择热区") {
    if (!roles.length) return "";
    return `<svg class="painting-overlay" viewBox="${viewBox}" role="img" aria-label="${label}">
      ${roles
        .map((role) => {
          const hotspot = role.paintingHotspot;
          if (!hotspot) return "";
          const active = titlePreviewRoleId === role.id;
          const outlinePath = hotspot.outlinePath || hotspot.points || "";
          const hitPath = hotspot.hitPath || hotspot.points || outlinePath;
          return `
            <g class="painting-role ${role.startEnabled ? "pc" : "npc"} ${active ? "active" : ""}">
              <polygon
                class="painting-hitbox ${role.startEnabled ? "pc" : "npc"} ${active ? "active" : ""}"
                data-action="pick-role"
                data-role="${role.id}"
                data-title-hotspot="true"
                tabindex="0"
                focusable="true"
                role="button"
                aria-label="查看 ${role.name}${role.startEnabled ? " 线路介绍" : " 档案"}"
                points="${hitPath}"
              >
                <title>${role.name}${role.startEnabled ? "" : "（仅供展示）"}</title>
              </polygon>
              <polygon
                class="painting-outline ${role.startEnabled ? "pc" : "npc"} ${active ? "active" : ""}"
                aria-hidden="true"
                focusable="false"
                points="${outlinePath}"
              ></polygon>
            </g>
          `;
        })
        .join("")}
    </svg>`;
  }

  function renderTitle() {
    const meta = loadMeta();
    const truthTitleMode = !!meta.titleTruthMode;
    const roles = listPresentationRoles(truthTitleMode ? "truth" : "normal");
    const groupImage = truthTitleMode ? (TITLE_PRESENTATION.truthGroupImage || TITLE_PRESENTATION.groupImage || "") : (TITLE_PRESENTATION.groupImage || "");
    const viewBox = TITLE_PRESENTATION.viewBox || "0 0 3840 1648";
    const previewStyle = titlePreviewCssVars();
    return `
      <section class="frame title-shell ${truthTitleMode ? "title-shell-1931" : ""}">
        <section class="title-painting-shell" data-title-shell>
          <div class="painting-copy title-copy">
            <h1 class="${truthTitleMode ? "truth-title-awakened" : ""}" data-action="manual-unlock-truth" role="button" tabindex="0">${truthTitleMode ? "牧羊人疗养院-1931" : "牧羊人疗养院"}</h1>
          </div>
          <div class="painting-stage ${titlePreviewRoleId ? "has-preview" : ""}" style="${previewStyle}">
            <img class="painting-image" src="${groupImage}" alt="${truthTitleMode ? "牧羊人疗养院 1931 合影" : "牧羊人疗养院角色合影"}" />
            ${renderTitleHotspots(roles, viewBox, truthTitleMode ? "1931 真相人物热区" : "角色选择热区")}
            ${renderTitleHoverBadge()}
          </div>
          ${truthTitleMode && !titlePreviewRoleId ? renderTitle1931Message() : renderTitlePreviewBand()}
          ${truthTitleMode ? renderTruthRouteEntry("title") : `
            <section class="title-onboarding panel">
              <div class="panel-headline">初次游玩导入</div>
              <div class="title-onboarding-grid">
                <span>你在封闭疗养院醒来，每 15 分钟选择一次行动、立场与风险。</span>
                <span>发电机决定能否逃生；真相、HP、SAN 与关系共同改变结局。</span>
                <span>v1.2 起，结局更重视证据、共同经历和角色直觉，不再只有唯一数值解。</span>
              </div>
            </section>
          `}
        </section>
      </section>
    `;
  }

  function renderSelect() {
    const selected = getPresentationRole();
    if (!selected) {
      return renderRecoveryPanel();
    }
    const saved = loadState();
    const savedRole = saved?.selectedRole && ROLE_DEFS[saved.selectedRole] ? ROLE_DEFS[saved.selectedRole] : null;
    return `
      <section class="frame page-shell">
        <div class="topbar">
          <div>
            <h1>人物介绍</h1>
            <p>${selected.startEnabled ? "确认这名角色的公开信息后，再进入她或他的单人视角线路。" : "该人物当前仅开放档案浏览，不提供独立开局。"}</p>
          </div>
          <div class="title-tags">
            <span class="tag-pill">${selected.kind === "pc" ? "可操作角色" : "剧情角色"}</span>
            <span class="tag-pill">${selected.startRoomLabel || selected.startRoom}</span>
            <span class="tag-pill">${selected.startEnabled ? "第二人称代入" : "档案浏览"}</span>
          </div>
        </div>
        <div class="character-intro-layout">
          <div class="intro-main-column">
            <section class="panel intro-portrait-panel">
              <img class="intro-portrait" src="${selected.portraitFull}" alt="${selected.name} 全身立绘" />
            </section>
            <section class="panel intro-copy-panel">
              <h2>${selected.name}</h2>
              <div class="intro-lead">
                <strong>${selected.introLead}</strong>
                <span>${selected.introBody}</span>
              </div>
              <div class="detail-line"><strong>公开身份</strong><span>${selected.publicRole}</span></div>
              <div class="detail-line"><strong>公开背景</strong><span>${selected.background}</span></div>
              <div class="detail-line"><strong>性格标签</strong><span>${selected.tags.join(" / ")}</span></div>
              <div class="detail-line"><strong>秘密摘要</strong><span>${selected.secretHint}</span></div>
              <div class="detail-line"><strong>代入提示</strong><span>${selected.introHint}</span></div>
              <div class="intro-actions">
                ${selected.startEnabled ? `<button class="btn primary" data-action="begin-role" data-role="${selected.id}">进入该角色线路</button>` : `<div class="npc-disabled-note">该角色当前仅提供档案浏览</div>`}
                <button class="btn" data-action="back-title">返回标题</button>
              </div>
            </section>
          </div>
          <aside class="panel intro-side-panel">
            <section class="intro-side-block">
              <h3>入口功能</h3>
              <div class="control-stack intro-side-actions">
                <button class="btn" data-action="resume" ${saved?.selectedRole ? "" : "disabled"}>继续上次进度</button>
                <button class="btn" data-action="open-save">手动读取存档</button>
                <button class="btn" data-action="archive">查看角色档案</button>
              </div>
            </section>
            <section class="intro-side-block">
              <h3>当前状态</h3>
              <div class="stats-block intro-side-stats">
                <div class="stat-chip"><span>已解锁档案</span><strong>${unlockedCount()} / 6</strong></div>
                <div class="stat-chip"><span>最近保存</span><strong>${savedRole ? `${savedRole.name} · ${SLOT_ORDER[saved.slotIndex || 0]}` : "无"}</strong></div>
                <div class="stat-chip"><span>当前人物</span><strong>${selected.startEnabled ? "可操作" : "仅供展示"}</strong></div>
                <div class="stat-chip"><span>初始房间</span><strong>${selected.startRoomLabel || selected.startRoom || "未公开"}</strong></div>
              </div>
            </section>
            <section class="intro-side-block">
              <h3>玩法说明</h3>
              <div class="bullet-list intro-bullet-list">
                <div>9 人可浏览，当前版本开放 6 条可玩线路。</div>
                <div>身份与能力不会在这里公开，需在通关后补完档案。</div>
                <div>进入游戏后仍保留存档、日志、快进与回看功能。</div>
              </div>
            </section>
          </aside>
        </div>
      </section>
    `;
  }

  function renderArchive() {
    const meta = loadMeta();
    return `
      <section class="frame page-shell">
        <div class="topbar">
          <div>
            <h1>角色档案</h1>
            <p>通关后补完隐藏身份、能力与更深层的人物真相。</p>
          </div>
          <div class="title-tags">
            <span class="tag-pill">已解锁 ${unlockedCount()} / 6</span>
            <span class="tag-pill">真相路线 ${meta.truthRouteUnlocked ? "已解锁" : `${meta.completedRoles.length} / ${PLAYABLE_ROLE_IDS.length}`}</span>
          </div>
        </div>
        ${renderTruthRouteEntry("archive")}
        <div class="archive-grid">
          ${Object.values(ROLE_DEFS)
            .map((role) => {
              const completed = meta.completedRoles.includes(role.id);
              const unlocked = !!state.archive[role.id] || completed;
              return `
                <article class="panel archive-card ${unlocked ? "" : "locked"} ${completed ? "completed" : ""}">
                  <h2>${role.name}</h2>
                  <div class="archive-meta">${role.publicRole} · ${role.startRoom}</div>
                  <p>${unlocked ? role.archive.truth : role.dossier}</p>
                  <div class="detail-line"><strong>公开背景</strong><span>${role.background}</span></div>
                  <div class="detail-line"><strong>秘密摘要</strong><span>${role.secretHint}</span></div>
                  <div class="detail-line"><strong>隐藏条目</strong><span>${unlocked ? `${role.archive.role} / ${role.archive.ability}` : "通关后解锁"}</span></div>
                  ${unlocked ? renderEndingGallery(role.id) : ""}
                </article>
              `;
            })
            .join("")}
        </div>
        <div class="footer-actions">
          <button class="btn primary" data-action="back-title">返回标题</button>
        </div>
      </section>
    `;
  }

  function renderTruthBlock(block) {
    if (!block) return "";
    const kind = block.kind || "paragraph";
    const text = escapeHtml(block.text || "");
    if (kind === "label") return `<div class="truth-material-label">${text}</div>`;
    if (kind === "meta") return `<div class="truth-material-meta">${text}</div>`;
    return `<p>${text}</p>`;
  }

  function renderTruthIndex() {
    const meta = loadMeta();
    const collections = truthCollections();
    return `
      <section class="frame page-shell truth-route-shell truth-folder-index-shell">
        <div class="topbar">
          <div>
            <h1>${TRUTH_ROUTE.title || "埃莉诺的文件夹"}</h1>
            <p>${TRUTH_ROUTE.subtitle || "上帝视角真相路线"} · ${escapeHtml(TRUTH_ROUTE.source || "剧本剧情真相.docx")}</p>
          </div>
          <div class="title-tags">
            <span class="tag-pill">${collections.length} 份材料</span>
            <span class="tag-pill">${meta.truthRouteCompleted ? "已读完" : "可自由阅读"}</span>
          </div>
        </div>
        <section class="panel truth-folder-index">
          <div class="truth-material-kicker">材料选择</div>
          <h2>埃莉诺的文件夹</h2>
          <p class="truth-folder-lead">这些材料来自《剧本剧情真相》的全部正文。选择任意文件开始阅读，阅读顺序不再由系统强制安排。</p>
          <div class="truth-folder-grid">
            ${collections.map((collection) => collection.headingOnly
              ? `
                <div class="truth-folder-section-title truth-folder-section-title-${collection.type || "folder"}">
                  <span>${escapeHtml(collection.label || "分类")}</span>
                  <strong>${escapeHtml(collection.title || "未命名分类")}</strong>
                  ${collection.sectionText ? `<p>${escapeHtml(collection.sectionText)}</p>` : ""}
                </div>
              `
              : `
                <button class="truth-folder-card truth-folder-card-${collection.type || "folder"}" data-action="open-truth-collection" data-collection="${escapeHtml(collection.id)}">
                  <span class="truth-folder-card-label">${escapeHtml(collection.label || "文件")}</span>
                  <strong>${escapeHtml(collection.title || "未命名材料")}</strong>
                  <span>${escapeHtml(collection.summary || "")}</span>
                  <em>${Array.isArray(collection.pages) ? collection.pages.length : 0} 页</em>
                </button>
              `).join("")}
          </div>
          <div class="footer-actions">
            <button class="btn primary" data-action="complete-truth">${meta.truthRouteCompleted ? "已完成真相路线" : "标记为已读完"}</button>
            <button class="btn" data-action="archive">查看档案</button>
            <button class="btn" data-action="back-title">返回标题</button>
          </div>
        </section>
      </section>
    `;
  }

  function renderEpilogue() {
    const acts = truthEpilogueActs();
    if (!acts.length) return renderTruthIndex();
    const total = acts.length;
    const actIndex = clamp(Number(state.epilogueActIndex || 0), 0, total - 1);
    const act = acts[actIndex] || acts[0];
    const paragraphs = Array.isArray(act.paragraphs) ? act.paragraphs : [];
    const textLength = paragraphs.join("").length;
    const duration = clamp(Math.round(textLength / 12), 24, 78);
    const isLast = actIndex >= total - 1;
    return `
      <section class="frame page-shell truth-route-shell epilogue-shell">
        <div class="topbar">
          <div>
            <h1>${TRUTH_ROUTE.title || "\u57c3\u8389\u8bfa\u7684\u6587\u4ef6\u5939"}</h1>
            <p>\u5c3e\u58f0 \u00b7 ${escapeHtml(act.title || "")}</p>
          </div>
          <div class="title-tags">
            <span class="tag-pill">\u7b2c ${actIndex + 1} / ${total} \u5e55</span>
            <span class="tag-pill" data-epilogue-speed-label>${state.epilogueFast ? "\u9ad8\u901f\u64ad\u653e" : "\u81ea\u52a8\u64ad\u653e"}</span>
          </div>
        </div>
        <div class="epilogue-audio-bar">
          <button class="btn" data-action="toggle-epilogue-audio" aria-pressed="false">\u64ad\u653e</button>
          <input class="epilogue-audio-progress" data-epilogue-audio-progress type="range" min="0" max="1000" value="0" aria-label="\u5c3e\u58f0BGM\u8fdb\u5ea6">
        </div>
        <section class="panel epilogue-stage ${state.epilogueFast ? "is-fast" : ""}" style="--epilogue-duration: ${duration}s;">
          <figure class="epilogue-cg">
            <img src="${escapeHtml(act.image || "")}" alt="${escapeHtml(act.title || "\u5c3e\u58f0CG")}">
            <figcaption>${escapeHtml(act.title || "")}</figcaption>
          </figure>
          <div class="epilogue-copy">
            <div class="truth-material-kicker">\u5c3e\u58f0</div>
            <h2>${escapeHtml(act.title || "")}</h2>
            <div class="epilogue-scroll-window" data-epilogue-scroll-window aria-live="polite" tabindex="0">
              <div class="epilogue-scroll-text">
                ${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
              </div>
            </div>
            <div class="footer-actions">
              <button class="btn primary" data-action="speed-epilogue" ${state.epilogueFast ? "disabled" : ""}>\u52a0\u901f\u6eda\u52a8</button>
              <button class="btn primary" data-action="next-epilogue">${isLast ? "\u7ed3\u675f\u5c3e\u58f0" : "\u8fdb\u5165\u4e0b\u4e00\u5e55"}</button>
              <button class="btn" data-action="truth-index">\u8fd4\u56de\u6750\u6599\u9009\u62e9</button>
              <button class="btn" data-action="archive">\u67e5\u770b\u6863\u6848</button>
              <button class="btn" data-action="back-title">\u8fd4\u56de\u6807\u9898</button>
            </div>
          </div>
        </section>
      </section>
    `;
  }

  function renderTruth() {
    const meta = loadMeta();
    if (state.truthCollectionId === EPILOGUE_COLLECTION_ID) return renderEpilogue();
    const collection = truthCollectionById();
    if (!collection) return renderTruthIndex();
    const pages = Array.isArray(collection.pages) ? collection.pages : [];
    const total = Math.max(1, pages.length);
    const pageIndex = clamp(Number(state.truthPageIndex || 0), 0, total - 1);
    const page = pages[pageIndex] || { heading: collection.title, blocks: [] };
    const blocks = Array.isArray(page.blocks) ? page.blocks : [];
    const pageType = collection.type || "folder";
    const isFirst = pageIndex <= 0;
    const isLast = pageIndex >= total - 1;
    return `
      <section class="frame page-shell truth-route-shell">
        <div class="topbar">
          <div>
            <h1>${TRUTH_ROUTE.title || "埃莉诺的文件夹"}</h1>
            <p>${escapeHtml(collection.title || "")}</p>
          </div>
          <div class="title-tags">
            <span class="tag-pill">第 ${pageIndex + 1} / ${total} 页</span>
            <span class="tag-pill">${meta.truthRouteCompleted ? "已读完" : escapeHtml(collection.label || "阅读中")}</span>
          </div>
        </div>
        <section class="panel truth-route-panel truth-material truth-material-${pageType}">
          <div class="truth-material-kicker">${escapeHtml(collection.label || "文件")}</div>
          <h2>${escapeHtml(page.heading || collection.title || "")}</h2>
          <div class="truth-material-body">${blocks.map(renderTruthBlock).join("")}</div>
          <div class="footer-actions">
            <button class="btn" data-action="truth-prev" ${isFirst ? "disabled" : ""}>上一页</button>
            <button class="btn primary" data-action="continue-truth" ${isLast ? "disabled" : ""}>下一页</button>
            <button class="btn" data-action="truth-index">材料选择</button>
            <button class="btn" data-action="archive">查看档案</button>
            <button class="btn" data-action="back-title">返回标题</button>
          </div>
        </section>
      </section>
    `;
  }

  function renderRouteTrace(roleId = state.selectedRole) {
    return `
      <div class="timeline-compact" aria-label="路线轨迹">
        ${SLOT_ORDER.map((id, index) => {
          const current = index === state.slotIndex;
          const passed = index < state.slotIndex || (state.phase !== "decision" && index === state.slotIndex);
          return `<div class="timeline-compact-cell ${current ? "current" : ""} ${passed ? "passed" : ""}" title="${id} ${SLOT_META[id].title}">${id}</div>`;
        }).join("")}
      </div>
    `;
  }

  function getClockTone(value) {
    if (value >= 75) return "danger";
    if (value >= 45) return "warn";
    return "calm";
  }

  function buildFictionalClocks(currentState = state) {
    const stats = currentState.stats || {};
    const relations = currentState.relations || {};
    const positive = Object.entries(relations).filter(([id, value]) => ENTITIES[id] && id !== currentState.selectedRole && Number(value || 0) >= 6).length;
    const hostile = Object.entries(relations).filter(([id, value]) => ENTITIES[id] && id !== currentState.selectedRole && Number(value || 0) <= -6).length;
    const danger = clamp((BASE_HP - Number(stats.hp || 0)) * 8 + (currentState.deadEntities?.length || 0) * 10 + (currentState.slotIndex || 0) * 5 + hostile * 4, 0, 100);
    const trust = clamp(positive * 18 + Object.keys(currentState.alliances || {}).length * 10 - hostile * 8, 0, 100);
    const contamination = clamp((99 - Number(stats.san || 0)) + Number(stats.truth || 0) * 0.35, 0, 100);
    return [
      { label: "真相推进", value: clamp(Number(stats.truth || 0), 0, 100), tone: getClockTone(Number(stats.truth || 0)), hint: getTruthTierLabel(stats.truth) },
      { label: "危险升温", value: danger, tone: getClockTone(danger), hint: danger >= 70 ? "疗养院正在收口" : danger >= 40 ? "压力开始聚集" : "仍有回旋空间" },
      { label: "信任网络", value: trust, tone: trust >= 55 ? "calm" : trust >= 25 ? "warn" : "danger", hint: trust >= 55 ? "有人愿意听你说话" : trust >= 25 ? "关系仍可补救" : "孤立风险上升" },
      { label: "精神污染", value: contamination, tone: getClockTone(contamination), hint: contamination >= 70 ? "所见正在反咬你" : contamination >= 40 ? "理解伴随代价" : "意识尚能整理" },
    ];
  }

  function renderFictionalClocks(currentState = state) {
    return `
      <section class="panel rail-card route-clock-card">
        <div class="panel-headline">局势钟</div>
        <div class="clock-list">
          ${buildFictionalClocks(currentState).map((clock) => `
            <div class="clock-item ${clock.tone}">
              <div class="clock-head"><strong>${escapeHtml(clock.label)}</strong><span>${Math.round(clock.value)}%</span></div>
              <div class="clock-track"><i style="width:${Math.round(clock.value)}%"></i></div>
              <small>${escapeHtml(clock.hint)}</small>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  function buildRouteNotebook(currentState = state) {
    const role = ROLE_DEFS[currentState.selectedRole] || currentRole();
    const slot = SLOT_ORDER[currentState.slotIndex || 0] || "1.1";
    const truth = Number(currentState.stats?.truth || 0);
    const generators = Number(currentState.generators?.progress || 0);
    const clues = Array.isArray(currentState.clues) ? currentState.clues : [];
    const relationFocus = Object.entries(currentState.relations || {})
      .filter(([id]) => ENTITIES[id] && id !== currentState.selectedRole)
      .sort((a, b) => Math.abs(Number(b[1] || 0)) - Math.abs(Number(a[1] || 0)))[0];
    const focusText = relationFocus ? `${ENTITIES[relationFocus[0]]?.short || relationFocus[0]} ${Number(relationFocus[1] || 0) >= 0 ? "+" : ""}${Number(relationFocus[1] || 0)}` : "关系尚未成形";
    const needs = [];
    if (generators < 4) needs.push("继续修复发电机");
    if (truth < 58) needs.push("补足能解释疗养院规则的线索");
    if (currentState.stats?.san < 34) needs.push("安排休整或降低精神代价");
    if (currentState.stats?.hp < 6) needs.push("避免继续硬闯");
    if (!needs.length) needs.push("把证据、关系和终局选择串起来");
    return {
      focus: `${role?.name || "主角"}在 ${slot} 的目标不是刷满数值，而是决定用什么立场活下去。`,
      known: clues.length ? clues.slice(-2).join(" / ") : `发电机 ${generators} / 4，真相处于“${getTruthTierLabel(truth)}”。`,
      relation: focusText,
      next: needs.slice(0, 2).join("；"),
    };
  }

  function renderRouteNotebook(currentState = state) {
    const note = buildRouteNotebook(currentState);
    return `
      <section class="panel rail-card route-note-card">
        <div class="panel-headline">路线笔记</div>
        <div class="route-note-line"><strong>当下</strong><span>${escapeHtml(note.focus)}</span></div>
        <div class="route-note-line"><strong>已知</strong><span>${escapeHtml(note.known)}</span></div>
        <div class="route-note-line"><strong>关系</strong><span>${escapeHtml(note.relation)}</span></div>
        <div class="route-note-line"><strong>缺口</strong><span>${escapeHtml(note.next)}</span></div>
      </section>
    `;
  }

  function renderGame() {
    const role = currentRole();
    const slotId = currentSlotId();
    const slot = currentSlotMeta();
    if (!role || !slotId || !slot) {
      return renderRecoveryPanel();
    }
    const options = getRoleOptions(role.id, slotId);
    const decision = state.phase === "decision";
    const truthVisible = getSanState(state) === "truth";
    const voteRevealMode = state.slotIndex === SLOT_ORDER.indexOf(VOTE_REVEAL_SLOT);
    const supperSceneMode = !!PC_SUPPER_SCENE_PROFILES[role.id] && !voteRevealMode;
    const supperSceneVisual = supperSceneMode ? buildSupperSceneVisual(role.id) : null;
    const sceneMapSrc = supperSceneMode
      ? CHARACTER_PRESENTATION[role.id]?.previewSlice || CHARACTER_PRESENTATION[role.id]?.portraitFull || slot.map
      : voteRevealMode
        ? SLOT_META[VOTE_REVEAL_SLOT].map
        : slot.map;
    const lowSanEcho = buildLowSanEcho(state, "header", slotId);
    return `
      <section class="frame game-layout ${isLowSan(state) ? "low-san" : ""}">
        <aside class="rail left-rail">
          <section class="panel rail-card">
            <div class="eyebrow">主视角</div>
            <h2>${role.name}</h2>
            <div class="role-role">${role.publicRole}</div>
            <p>${role.dossier}</p>
            <div class="tag-row">${role.tags.map((tag) => `<span class="small-pill">${tag}</span>`).join("")}</div>
          </section>
          <section class="panel rail-card">
            <div class="panel-headline">状态</div>
            <div class="meter-list">
              ${renderMeter("HP", state.stats.hp, state.maxStats.hp, { status: getHpLabel(state) })}
              ${renderMeter("MP", state.stats.mp, state.maxStats.mp, { status: getMpLabel(state) })}
              ${renderMeter("SAN", state.stats.san, 99, { status: `${getSanLabel(state)}${getSanHint(state)}` })}
              ${renderMeter("真相", truthVisible ? state.stats.truth : 0, 100, { status: truthVisible ? getTruthTierLabel(state.stats.truth) : "隐藏", hideValue: !truthVisible, hideBar: !truthVisible })}
              ${renderMeter("发电机", state.generators.progress, 4, { status: state.generators.progress ? getGeneratorNotice(state.generators.progress) : "待启动" })}
            </div>
            <div class="notice-box compact-notice ${isLowSan(state) ? "low-san-hint" : ""}"><strong>提示</strong><span>${getSanState(state) === "truth" ? `你看见真实，${getTruthTierLabel(state.stats.truth)}。` : state.stats.mp <= 0 ? getMpEmptyNotice(state) : state.notice || "当前仍以叙事推进为主。"}</span>${lowSanEcho ? `<span class="san-echo">${escapeHtml(lowSanEcho)}</span>` : ""}</div>
          </section>
          <section class="panel rail-card">
            <div class="panel-headline">关系波动</div>
            <div class="relation-list">
              ${Object.keys(ENTITIES)
                .filter((key) => key !== role.id && isEntityAlive(state, key))
                .sort((a, b) => Math.abs(state.relations[b] || 0) - Math.abs(state.relations[a] || 0))
                .slice(0, 6)
                .map((key) => renderRelationSnapshotItem(key))
                .join("")}
            </div>
          </section>
        </aside>
        <main class="story-column">
          <section class="panel scene-header">
            <div>
              <div class="eyebrow">${voteRevealMode ? "审判余波" : slot.arc}</div>
              <h1>${voteRevealMode ? "4.5 · 票型公开" : `${slotId} · ${slot.title}`}</h1>
              <p>${voteRevealMode ? "票纸已经翻开。疗养院不会替任何人保留体面。" : slot.prompt}</p>
              ${lowSanEcho ? `<div class="scene-whisper">${escapeHtml(lowSanEcho)}</div>` : ""}
            </div>
            <div class="title-tags">
              <span class="tag-pill">${voteRevealMode ? "A13 · 石室" : slot.locationCode}</span>
              <span class="tag-pill">${voteRevealMode ? "票型公开" : decision ? "分歧选择" : "结果回放"}</span>
            </div>
          </section>
          <section class="panel scene-map ${supperSceneMode ? `supper-scene-map role-${role.id}` : ""}">
            <img class="scene-map-base" src="${sceneMapSrc}" alt="${voteRevealMode ? "票型公开" : supperSceneMode ? `${role.name}的长桌心象` : slot.location}" />
            ${
              supperSceneMode
                ? `
                  <div class="supper-backdrop" aria-hidden="true">
                    <div class="supper-arch"></div>
                    <div class="supper-halo"></div>
                    <div class="supper-table"></div>
                    ${renderSupperSceneVisual(role, supperSceneVisual)}
                  </div>
                `
                : ""
            }
            <div class="map-overlay">
              ${supperSceneMode ? renderChoiceEchoLayer(state) : ""}
              <div class="tag-row">
                <span class="tag-pill">${voteRevealMode ? "A13 · 投票房" : slot.location}</span>
                <span class="tag-pill">${voteRevealMode ? "票型与死亡已经落地" : supperSceneMode ? escapeHtml(buildSupperSceneStatusChip(role.id, slotId, state)) : slot.anchor}</span>
              </div>
              <p>${voteRevealMode ? "你得看着每一张票变成名字，再看着名字变成死路。" : supperSceneMode ? escapeHtml(buildSupperSceneVoice(role.id, slotId, state)) : buildDecisionContext(role.id, slotId)}</p>
            </div>
          </section>
          ${
            voteRevealMode
              ? renderVoteRevealPanel(role)
              : decision
              ? `
                <section class="panel narrative-panel">
                  <div class="notice-box ${isLowSan(state) ? "low-san-hint" : ""}">
                    <strong>时段回响</strong>
                    <span>${state.notice || "线路刚开始，你还来不及知道自己的选择会在哪一处墙角回响。"} </span>
                    ${lowSanEcho ? `<span class="san-echo">${escapeHtml(lowSanEcho)}</span>` : ""}
                  </div>
                  <div class="option-grid">
                    ${["A", "B", "C"]
                      .map((key) => renderReadableOptionCard(role.id, slotId, key, options[key]))
                      .join("")}
                  </div>
                  ${renderFictionalClocks(state)}
                </section>
              `
              : renderSceneResult()
          }
        </main>
        <aside class="rail right-rail">
          <section class="panel rail-card">
            <div class="panel-headline">密码与线索</div>
            <div class="tag-row">${PASSWORD_WORDS.map((word) => `<span class="password-pill ${state.generators.words.includes(word) ? "on" : ""}">${word}</span>`).join("")}</div>
            <div class="clue-list">
              ${state.clues.length ? state.clues.slice(-8).map((clue) => `<div class="clue-item">${clue}</div>`).join("") : `<div class="clue-item muted">尚未整理出可靠线索</div>`}
            </div>
          </section>
          <section class="panel rail-card">
            <div class="panel-headline">系统功能</div>
            <div class="control-stack">
              <button class="btn" data-action="undo-choice" ${state.undoStack?.length ? "" : "disabled"}>撤回上一步</button>
              <button class="btn" data-action="toggle-fast">${state.fast ? "关闭快进摘要" : "开启快进摘要"}</button>
              <button class="btn" data-action="open-log">回看日志</button>
              <button class="btn" data-action="open-save">手动存档</button>
              <button class="btn" data-action="toggle-sound">${state.sound ? "关闭按钮音" : "开启按钮音"}</button>
              <button class="btn" data-action="back-title">返回标题</button>
            </div>
          </section>
          <section class="panel rail-card">
            <div class="panel-headline">路线轨迹</div>
            ${renderRouteTrace(role.id)}
          </section>
          ${renderRouteNotebook(state)}
        </aside>
      </section>
    `;
  }

  function renderMeter(label, value, max, options = {}) {
    const hideValue = !!options.hideValue;
    const hideBar = !!options.hideBar;
    const status = options.status || "";
    const width = hideBar ? 0 : Math.round((value / max) * 100);
    return `
      <div class="meter-card">
        <div class="meter-head"><strong>${label}</strong><span>${hideValue ? "？？？" : `${value} / ${max}`}${status ? ` · ${status}` : ""}</span></div>
        <div class="meter-bar"><span style="width:${width}%"></span></div>
      </div>
    `;
  }

  function describeVoteReason(voterId, playerId) {
    if (voterId === "player") return { tone: "neutral", text: "这是你在 4.4 亲手写下的票。", score: 3 };
    const relation = clamp(Number(state.relations?.[voterId] || 0), RELATION_MIN, RELATION_MAX);
    const confused = !hasKarlExposedBeforeVote(state) && relation >= -15 && relation <= 15;
    if (relation <= -16) {
      return { tone: "fail", text: `${ENTITIES[voterId]?.short || voterId} 对你的关系是 ${relation}，已低于 -16，因此必定投你。`, score: 1 };
    }
    if (relation >= 16) {
      return { tone: "pass", text: `${ENTITIES[voterId]?.short || voterId} 对你的关系是 ${relation}，已高于 16，因此会跟随你的票型。`, score: 1 };
    }
    if (confused) {
      const weightText = relation >= -15 && relation <= -6
        ? "投你的随机权重提高 50%"
        : relation >= -5 && relation <= -1
          ? "投你的随机权重提高 25%"
          : relation >= 1 && relation <= 5
            ? "投你的随机权重降低 25%"
            : relation >= 6 && relation <= 15
              ? "投你的随机权重降低 50%"
              : "投你的随机权重不变";
      return { tone: relation < 0 ? "fail" : relation > 0 ? "pass" : "neutral", text: `${ENTITIES[voterId]?.short || voterId} 对你的关系是 ${relation}，但投票前卡尔尚未被真正揭露，因此陷入迷茫乱投；${weightText}。`, score: 2 };
    }
    if (relation >= -15 && relation <= -6) {
      return { tone: "fail", text: `${ENTITIES[voterId]?.short || voterId} 对你的关系是 ${relation}，敌意让投你的权重提高 50%，再与怀疑和剧情站位合并判定。`, score: 2 };
    }
    if (relation >= -5 && relation <= -1) {
      return { tone: "fail", text: `${ENTITIES[voterId]?.short || voterId} 对你的关系是 ${relation}，轻微敌意让投你的权重提高 25%，再与怀疑和剧情站位合并判定。`, score: 2 };
    }
    if (relation >= 1 && relation <= 5) {
      return { tone: "pass", text: `${ENTITIES[voterId]?.short || voterId} 对你的关系是 ${relation}，轻微信任让投你的权重降低 25%，再与怀疑和剧情站位合并判定。`, score: 2 };
    }
    if (relation >= 6 && relation <= 15) {
      return { tone: "pass", text: `${ENTITIES[voterId]?.short || voterId} 对你的关系是 ${relation}，信任让投你的权重降低 50%，再与怀疑和剧情站位合并判定。`, score: 2 };
    }
    return { tone: "neutral", text: `${ENTITIES[voterId]?.short || voterId} 处于中立点（${relation}），投你权重不变，由当前怀疑与剧情站位决定。`, score: 2 };
  }

  function buildVoteInsight(role) {
    const playerId = role.id;
    const entries = Object.entries(state.voteLedger || {}).map(([voterId, targetId]) => {
      const voterName = voterId === "player" ? "你" : ENTITIES[voterId]?.short || voterId;
      const targetName = targetId === playerId ? "你" : targetId === "abstain" ? "弃权" : ENTITIES[targetId]?.short || targetId;
      const reason = describeVoteReason(voterId, playerId);
      return {
        voterId,
        voterName,
        targetName,
        reason,
      };
    });
    return entries
      .sort((a, b) => a.reason.score - b.reason.score)
      .slice(0, 5);
  }

  function buildVoteInsightSummary(role) {
    const playerId = role.id;
    const summary = {
      playerBallot: state.voteLedger?.player ? 1 : 0,
      hostileLocks: 0,
      hostileStrongWeights: 0,
      hostileLightWeights: 0,
      trustLightReductions: 0,
      trustStrongReductions: 0,
      followVotes: 0,
      neutralReads: 0,
      confusedReads: 0,
    };
    const karlExposed = hasKarlExposedBeforeVote(state);
    Object.keys(state.voteLedger || {}).forEach((voterId) => {
      if (voterId === "player") return;
      const relation = clamp(Number(state.relations?.[voterId] || 0), RELATION_MIN, RELATION_MAX);
      if (relation <= -16) {
        summary.hostileLocks += 1;
      } else if (relation >= 16) {
        summary.followVotes += 1;
      } else {
        if (!karlExposed && relation >= -15 && relation <= 15) summary.confusedReads += 1;
        if (relation >= -15 && relation <= -6) {
          summary.hostileStrongWeights += 1;
        } else if (relation >= -5 && relation <= -1) {
          summary.hostileLightWeights += 1;
        } else if (relation >= 1 && relation <= 5) {
          summary.trustLightReductions += 1;
        } else if (relation >= 6 && relation <= 15) {
          summary.trustStrongReductions += 1;
        } else {
          summary.neutralReads += 1;
        }
      }
    });
    const topTargetId = Object.entries(state.voteTally || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    const topTargetLabel = topTargetId
      ? topTargetId === playerId
        ? "你"
        : ENTITIES[topTargetId]?.short || topTargetId
      : "无人";
    const summaryText = state.exiledByVote
      ? `至少有 ${summary.hostileLocks} 张票被关系直接锁到你身上，剩下的中立判断也没能把局面拉回来。`
      : summary.confusedReads > 0
        ? `卡尔尚未被真正揭露，${summary.confusedReads} 名中间关系者陷入迷茫乱投，票面被随机和关系权重共同推向了 ${topTargetLabel}。`
      : summary.followVotes > summary.hostileLocks
        ? `高信任跟票占了上风，你在 4.4 铺下的站位真正影响了票面。`
        : summary.hostileLocks > 0
          ? `敌意锁票已经足够重，哪怕还有人犹豫，票面也被推向了 ${topTargetLabel}。`
          : `决定胜负的主要是中立带的怀疑与站位，票面并不是单靠情绪倒下来的。`;
    return {
      summaryText,
      items: [
        { tone: "neutral", label: "你的票", value: summary.playerBallot, detail: "4.4 亲手写下" },
        { tone: "fail", label: "强敌意锁票", value: summary.hostileLocks, detail: "<= -16 必投你" },
        { tone: "fail", label: "强敌意加权", value: summary.hostileStrongWeights, detail: "-15 ~ -6 投你 +50%" },
        { tone: "fail", label: "轻敌意加权", value: summary.hostileLightWeights, detail: "-5 ~ -1 投你 +25%" },
        { tone: "neutral", label: "迷茫乱投", value: summary.confusedReads, detail: "未揭露卡尔时随机" },
        { tone: "pass", label: "高信任跟票", value: summary.followVotes, detail: ">= 16 跟随你的票型" },
        { tone: "pass", label: "轻信任减权", value: summary.trustLightReductions, detail: "1 ~ 5 投你 -25%" },
        { tone: "pass", label: "强信任减权", value: summary.trustStrongReductions, detail: "6 ~ 15 投你 -50%" },
        { tone: "neutral", label: "中立判定", value: summary.neutralReads, detail: "0 权重不变" },
      ],
    };
  }

  function renderVoteInsight(entries = []) {
    if (!entries.length) return "";
    return `
      <div class="vote-insight">
        <strong>票型判读</strong>
        <div class="vote-insight-list">
          ${entries.map((entry) => `
            <div class="vote-insight-item ${entry.reason.tone}">
              <strong>${escapeHtml(entry.voterName)} → ${escapeHtml(entry.targetName)}</strong>
              <span>${escapeHtml(entry.reason.text)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderVoteExileSilhouette(role, deathLabels = []) {
    const playerId = role.id;
    const primaryDeathId = (state.voteDeaths || [])[0] || Object.entries(state.voteTally || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    const primaryLabel = primaryDeathId
      ? primaryDeathId === playerId
        ? "\u4f60"
        : ENTITIES[primaryDeathId]?.short || primaryDeathId
      : "\u65e0\u4eba";
    const deathText = deathLabels.length ? deathLabels.join(" / ") : primaryLabel;
    return `
      <div class="vote-exile-visual ${state.exiledByVote ? "is-player" : ""}">
        <div class="vote-exile-silhouette" aria-hidden="true">
          <span></span>
        </div>
        <div class="vote-exile-caption">
          <strong>${escapeHtml(primaryLabel)}</strong>
          <span>${state.exiledByVote ? "\u73a9\u5bb6\u88ab\u653e\u9010" : `\u653e\u9010\u540d\u5355\uff1a${escapeHtml(deathText)}`}</span>
        </div>
      </div>
    `;
  }

  function renderVoteRevealPanel(role) {
    const ledgerEntries = Object.entries(state.voteLedger || {});
    const deathLabels = (state.voteDeaths || []).map((id) => id === role.id ? "\u4f60" : ENTITIES[id]?.short || id);
    const playerId = role.id;
    const tallyEntries = Object.entries(state.voteTally || {}).sort((a, b) => b[1] - a[1]);
    const topCount = tallyEntries[0]?.[1] || 0;
    const topVotes = tallyEntries.filter(([, count]) => count === topCount).map(([id]) => id === playerId ? "\u4f60" : ENTITIES[id]?.short || id);
    const totalVotes = ledgerEntries.filter(([, targetId]) => targetId && targetId !== "abstain").length;
    const abstainVotes = ledgerEntries.filter(([, targetId]) => targetId === "abstain").length;
    const playerVotes = Number(state.voteTally?.[playerId] || 0);
    const voteInsight = buildVoteInsight(role);
    const voteInsightSummary = buildVoteInsightSummary(role);
    return `
      <section class="panel narrative-panel vote-reveal-panel">
        <div class="notice-box result-summary ${state.exiledByVote ? "heavy" : ""}">
          <strong>\u6295\u7968\u7ed3\u679c</strong>
          <span>${state.exiledByVote ? "\u6700\u9ad8\u7968\u843d\u5728\u4f60\u8eab\u4e0a\u3002\u4f60\u6ca1\u6709\u673a\u4f1a\u8fdb\u5165\u7b2c\u4e94\u5c0f\u65f6\u3002" : `\u6700\u9ad8\u7968\u8005\uff1a${topVotes.join(" / ")}\u3002`}</span>
        </div>
        <div class="vote-reveal-hero">
          ${renderVoteExileSilhouette(role, deathLabels)}
          <div class="vote-stat-board">
            <div class="vote-stat"><span>\u6709\u6548\u7968</span><strong>${totalVotes}</strong><em>\u5f03\u6743 ${abstainVotes}</em></div>
            <div class="vote-stat ${state.exiledByVote ? "fail" : ""}"><span>\u6295\u5411\u4f60</span><strong>${playerVotes}</strong><em>${state.exiledByVote ? "\u653e\u9010\u6210\u7acb" : "\u4ecd\u53ef\u524d\u8fdb"}</em></div>
            <div class="vote-stat"><span>\u6700\u9ad8\u7968</span><strong>${topCount}</strong><em>${escapeHtml(topVotes.join(" / ") || "\u65e0")}</em></div>
            <div class="vote-stat"><span>\u653e\u9010\u6570</span><strong>${deathLabels.length}</strong><em>${escapeHtml(deathLabels.join(" / ") || "\u65e0\u4eba")}</em></div>
          </div>
        </div>
        <div class="notice-box">
          <strong>\u7968\u578b\u6458\u8981</strong>
          <span>${state.exiledByVote ? "\u4f60\u88ab\u63a8\u6210\u6700\u9ad8\u7968\u3002\u653e\u9010\u5df2\u7ecf\u6210\u7acb\u3002" : `\u5e76\u5217\u6700\u9ad8\u5c06\u4e00\u8d77\u6b7b\u4ea1\u3002\u5f53\u524d\u6700\u9ad8\u7968\uff1a${topVotes.join(" / ")}\u3002`}</span>
          <div class="vote-summary-grid">
            ${voteInsightSummary.items.map((item) => `
              <div class="vote-summary-item ${item.tone}">
                <strong>${item.label}</strong>
                <span>${item.value}</span>
                <em>${item.detail}</em>
              </div>
            `).join("")}
          </div>
          <p class="vote-summary-text">${voteInsightSummary.summaryText}</p>
        </div>
        <div class="vote-tally">
          <div class="clue-item"><strong>\u6b7b\u4ea1\u540d\u5355</strong> \u00b7 ${deathLabels.join(" / ") || "\u65e0"}</div>
        </div>
        ${renderVoteInsight(voteInsight)}
        <div class="vote-ledger">
          ${ledgerEntries.map(([voterId, targetId]) => {
            const voterName = voterId === "player" ? "\u4f60" : ENTITIES[voterId]?.short || voterId;
            const targetName = targetId === playerId ? "\u4f60" : targetId === "abstain" ? "\u5f03\u6743" : ENTITIES[targetId]?.short || targetId;
            return `<div class="relation-item"><strong>${voterName}</strong><span>\u6295\u7ed9 ${targetName}</span></div>`;
          }).join("")}
        </div>
        <div class="vote-tally">
          ${Object.entries(state.voteTally || {}).map(([targetId, count]) => {
            const targetName = targetId === playerId ? "\u4f60" : ENTITIES[targetId]?.short || targetId;
            return `<div class="clue-item"><strong>${targetName}</strong> \u00b7 ${count} \u7968</div>`;
          }).join("")}
        </div>
        <div class="story-text">
          <p>${state.exiledByVote ? "\u4f60\u4eb2\u773c\u770b\u7740\u7968\u7eb8\u5728\u77f3\u684c\u4e0a\u53e0\u51fa\u4f60\u7684\u540d\u5b57\u3002\u4e89\u8fa9\u6ca1\u6709\u518d\u7ee7\u7eed\uff0c\u7597\u517b\u9662\u4e5f\u4e0d\u518d\u7ed9\u4f60\u4e0b\u4e00\u6bb5\u65f6\u95f4\u3002" : `\u77f3\u5ba4\u91cc\u6ca1\u6709\u4eba\u80fd\u88c5\u4f5c\u610f\u5916\u3002${deathLabels.join(" / ") || "\u65e0\u4eba"}\u88ab\u63a8\u5230\u4e86\u6700\u4eae\u7684\u4f4d\u7f6e\uff0c\u63a5\u4e0b\u6765\u6240\u6709\u4eba\u90fd\u53ea\u80fd\u5e26\u7740\u8fd9\u4e2a\u7ed3\u679c\u5f80\u524d\u8d70\u3002`}</p>
          <p>${state.exiledByVote ? "\u4f60\u7684\u8def\u7ebf\u5728\u8fd9\u91cc\u88ab\u7968\u578b\u622a\u65ad\u3002\u540e\u9762\u7684\u89c9\u9192\u3001\u8ffd\u9010\u4e0e\u767d\u95e8\uff0c\u90fd\u4e0d\u4f1a\u518d\u7531\u4f60\u4eb2\u81ea\u7ecf\u5386\u3002" : "\u6d3b\u4e0b\u6765\u7684\u4eba\u4f1a\u628a\u521a\u624d\u7684\u7968\u5411\u5e26\u8fdb\u7b2c\u4e94\u5c0f\u65f6\u3002\u4fe1\u4efb\u3001\u6028\u6068\u548c\u540e\u6094\u90fd\u4e0d\u4f1a\u88ab\u6295\u7968\u6e05\u7a7a\uff0c\u53ea\u4f1a\u88ab\u653e\u5927\u3002"}</p>
          <p>${state.exiledByVote ? "\u7597\u517b\u9662\u5df2\u7ecf\u66ff\u4f60\u9009\u4e86\u7ed3\u5c40\u3002" : "\u6295\u7968\u5df2\u7ecf\u628a\u4e0b\u4e00\u5c0f\u65f6\u7684\u654c\u53cb\u91cd\u65b0\u6d17\u8fc7\u4e00\u904d\u3002"}</p>
        </div>
        <div class="footer-actions">
          <button class="btn primary" data-action="continue-slot">${state.exiledByVote ? "\u7ed3\u7b97\u7ed3\u5c40" : "\u8fdb\u5165 5.1"}</button>
          <button class="btn" data-action="open-log">\u67e5\u770b\u65e5\u5fd7</button>
        </div>
      </section>
    `;
  }

  function buildDecisionContext(roleId, slotId) {
    const slot = SLOT_META[slotId];
    const role = ROLE_DEFS[roleId];
    const prefix =
      roleId === "fan"
        ? "你本能地先想，这是否又是一场被包装成恩赐的试炼。"
        : roleId === "ziche"
          ? "你先看退路，再看人，最后才看故事。"
          : roleId === "yamada"
            ? "你先决定要把哪张表情挂在脸上，再决定要不要真的靠近。"
            : roleId === "anjie"
              ? "你在心里先列出假设，再决定该从哪条线开始验证。"
              : roleId === "debora"
                ? "你习惯先把自己放到最不显眼的位置，然后观察谁以为自己最安全。"
                : "你会先听哪扇门最冷、哪段走廊先回声，再决定要不要靠近。";
    return `${prefix} ${slot.prompt} ${state.notice || ""}`.trim();
  }

  function buildSupperSceneVisual(roleId) {
    const present = CHARACTER_PRESENTATION[roleId] || {};
    const groupImage = TITLE_PRESENTATION.groupImage || "./assets/ui/title-group.png";
    const hotspot = present.paintingHotspot || {};
    const sourcePath = hotspot.outlinePath || hotspot.points || hotspot.hitPath || "";
    const pointPairs = [...String(sourcePath).matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map((match) => [Number(match[1]), Number(match[2])]);
    if (!pointPairs.length) {
      return {
        mode: "outline",
        groupImage,
        viewBox: "0 420 900 900",
        clipPath: "0,420 900,420 900,1320 0,1320",
        maskRect: { x: 0, y: 420, width: 900, height: 900 },
      };
    }
    const xs = pointPairs.map(([x]) => x);
    const ys = pointPairs.map(([, y]) => y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = Math.max(420, maxX - minX);
    const height = Math.max(600, maxY - minY);
    if (PC_SUPPER_SCENE_PROFILES[roleId]) {
      if (roleId === "patrick") {
        return {
          mode: "rect",
          groupImage,
          viewBox: "2440 500 620 760",
          rect: { x: 2440, y: 500, width: 620, height: 760 },
          focusX: 58,
        };
      }
      const rectW = Math.min(760, Math.max(620, Math.round(width * 1.18)));
      const rectH = Math.min(860, Math.max(720, Math.round(height + 190)));
      const centerX = (minX + maxX) / 2;
      const viewX = clamp(Math.round(centerX - rectW * 0.5), 0, 3840 - rectW);
      const viewY = clamp(Math.round(minY - 65), 360, 1648 - rectH);
      const focusX = clamp(Math.round(((centerX - viewX) / rectW) * 100), 38, 62);
      return {
        mode: "rect",
        groupImage,
        viewBox: `${viewX} ${viewY} ${rectW} ${rectH}`,
        rect: { x: viewX, y: viewY, width: rectW, height: rectH },
        focusX,
      };
    }
    const padX = Math.max(180, width * 0.42);
    const padYTop = Math.max(130, height * 0.24);
    const padYBottom = Math.max(150, height * 0.24);
    const viewX = clamp(Math.round(minX - padX), 0, 3840);
    const viewY = clamp(Math.round(minY - padYTop), 0, 1648);
    const viewW = clamp(Math.round(width + padX * 2), 420, 3840 - viewX);
    const viewH = clamp(Math.round(height + padYTop + padYBottom), 600, 1648 - viewY);
    return {
      mode: "outline",
      groupImage,
      viewBox: `${viewX} ${viewY} ${viewW} ${viewH}`,
      clipPath: sourcePath,
      maskRect: { x: viewX, y: viewY, width: viewW, height: viewH },
    };
  }

  function renderSupperSceneVisual(role, visual) {
    if (visual.mode === "rect") {
      return `
        <svg class="supper-portrait-rect-soft" viewBox="${visual.viewBox}" aria-hidden="true" focusable="false">
          <defs>
            <filter id="supper-rect-soft-blur-${role.id}" x="-18%" y="-18%" width="136%" height="136%">
              <feGaussianBlur stdDeviation="24"></feGaussianBlur>
            </filter>
          </defs>
          <image href="${visual.groupImage}" width="3840" height="1648" preserveAspectRatio="xMidYMid slice" filter="url(#supper-rect-soft-blur-${role.id})"></image>
        </svg>
        <svg class="supper-portrait-rect" viewBox="${visual.viewBox}" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="supper-rect-focus-${role.id}" cx="${visual.focusX || 52}%" cy="50%" r="72%">
              <stop offset="0%" stop-color="white" stop-opacity="1"></stop>
              <stop offset="46%" stop-color="white" stop-opacity="0.96"></stop>
              <stop offset="70%" stop-color="white" stop-opacity="0.42"></stop>
              <stop offset="100%" stop-color="white" stop-opacity="0"></stop>
            </radialGradient>
            <mask id="supper-rect-mask-${role.id}" x="${visual.rect.x}" y="${visual.rect.y}" width="${visual.rect.width}" height="${visual.rect.height}" maskUnits="userSpaceOnUse">
              <rect x="${visual.rect.x}" y="${visual.rect.y}" width="${visual.rect.width}" height="${visual.rect.height}" fill="url(#supper-rect-focus-${role.id})"></rect>
            </mask>
          </defs>
          <image href="${visual.groupImage}" width="3840" height="1648" preserveAspectRatio="xMidYMid slice" mask="url(#supper-rect-mask-${role.id})"></image>
        </svg>
      `;
    }
    return `
      <svg class="supper-portrait-soft" viewBox="${visual.viewBox}" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="supper-soft-clip-${role.id}" clipPathUnits="userSpaceOnUse">
            <polygon points="${visual.clipPath}"></polygon>
          </clipPath>
          <filter id="supper-soft-blur-${role.id}" x="-24%" y="-24%" width="148%" height="148%">
            <feGaussianBlur stdDeviation="18"></feGaussianBlur>
          </filter>
        </defs>
        <image href="${visual.groupImage}" width="3840" height="1648" preserveAspectRatio="xMidYMid meet" clip-path="url(#supper-soft-clip-${role.id})" filter="url(#supper-soft-blur-${role.id})"></image>
      </svg>
      <svg class="supper-portrait" viewBox="${visual.viewBox}" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="supper-clip-${role.id}" clipPathUnits="userSpaceOnUse">
            <polygon points="${visual.clipPath}"></polygon>
          </clipPath>
        </defs>
        <image href="${visual.groupImage}" width="3840" height="1648" preserveAspectRatio="xMidYMid meet" clip-path="url(#supper-clip-${role.id})"></image>
      </svg>
    `;
  }

  function buildChoiceEchoItems(currentState = state, limit = 5) {
    const route = Array.isArray(currentState?.route) ? currentState.route : [];
    return route
      .slice(-limit)
      .reverse()
      .map((entry, index) => ({
        slotId: String(entry?.slotId || ""),
        optionKey: String(entry?.optionKey || ""),
        optionLabel: String(entry?.optionLabel || entry?.summary || ""),
        age: index,
      }))
      .filter((item) => item.slotId && item.optionLabel);
  }

  function renderChoiceEchoLayer(currentState = state) {
    const items = buildChoiceEchoItems(currentState);
    if (!items.length) return "";
    return `
      <div class="choice-echo-layer" aria-hidden="true">
        ${items
          .map((item) => {
            const key = `${escapeHtml(item.slotId)}${item.optionKey ? ` · ${escapeHtml(item.optionKey)}` : ""}`;
            return `
              <div class="choice-echo-item age-${item.age}" style="--i: ${item.age};">
                <span class="choice-echo-key">${key}</span>
                <span class="choice-echo-text">${escapeHtml(item.optionLabel)}</span>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function getSupperSceneStateKey(roleId, slotId, currentState = state) {
    const hp = Number(currentState?.stats?.hp || 0);
    const maxHp = Number(currentState?.maxStats?.hp || BASE_HP) || BASE_HP;
    const san = Number(currentState?.stats?.san || 0);
    const truth = Number(currentState?.stats?.truth || 0);
    const generatorProgress = Number(currentState?.generators?.progress || 0);
    const profile = PC_SUPPER_SCENE_PROFILES[roleId] || {};
    const bondTarget = profile.bondTarget;
    const bondRelation = bondTarget ? Number(currentState?.relations?.[bondTarget] || 0) : 0;
    if (hp > 0 && hp / maxHp <= 0.5) return "wounded";
    if (san < 30) return "lowSan";
    if (truth >= 76) return "truthHigh";
    if (currentState?.flags?.voteOutcome || String(slotId || "").startsWith("4.")) return "vote";
    if (generatorProgress >= 4) return "powered";
    if (truth >= 51) return "truthMid";
    if (bondRelation >= 14) return "bond";
    if (generatorProgress > 0) return "generator";
    if (currentState?.phase === "result") return "result";
    return "base";
  }

  function buildSupperSceneVoice(roleId, slotId, currentState = state) {
    const profile = PC_SUPPER_SCENE_PROFILES[roleId] || PC_SUPPER_SCENE_PROFILES.anjie;
    const stateKey = getSupperSceneStateKey(roleId, slotId, currentState);
    if (stateKey !== "base" && profile.stateVoices?.[stateKey]) return profile.stateVoices[stateKey];
    return profile.slotVoices?.[slotId] || buildDecisionContext(roleId, slotId);
  }

  function buildSupperSceneStatusChip(roleId, slotId, currentState = state) {
    const profile = PC_SUPPER_SCENE_PROFILES[roleId] || PC_SUPPER_SCENE_PROFILES.anjie;
    const stateKey = getSupperSceneStateKey(roleId, slotId, currentState);
    return profile.stateChips?.[stateKey] || profile.stateChips?.base || "心声：长桌心象";
  }

  function buildAnjieSceneVoice(slotId, currentState = state) {
    return buildSupperSceneVoice("anjie", slotId, currentState);
  }

  function buildAnjieSceneStatusChip(slotId, currentState = state) {
    return buildSupperSceneStatusChip("anjie", slotId, currentState);
  }

  function renderOptionCard(roleId, slotId, key, label) {
    const module = getOptionModule(roleId, slotId, key);
    const intent = analyzeChoice(label, key, slotId, roleId);
    const compactLabel = compactDecisionLabel(roleId, slotId, label, key);
    const compactRoute = COMPACT_RESULT_ROUTE_IDS.has(roleId);
    const reason = getOptionDisabledReason(state, slotId, intent);
    const disabled = !!reason;
    const restedThisSlot = intent.tags.includes("rest") && hasRestedThisSlot(state, slotId);
    const exhausted = state.stats.mp <= 0;
    const previewLines = getIntentPreviewLines(intent, state, slotId);
    const chips = [];
    if (!compactRoute) {
      if (intent.tags.includes("rest")) chips.push("休息");
      if (intent.tags.includes("generator")) chips.push("发电机");
      if (intent.plannedGeneratorSlot) chips.push(`${intent.generatorOpportunityKind === "fallback" ? "补救推进" : intent.generatorOpportunityKind === "support" ? "协助供电" : "供电推进"} ${intent.mpCost}`);
      if (intent.tags.includes("social")) chips.push("社交");
      if (intent.tags.includes("investigate")) chips.push("调查");
      if (intent.tags.includes("attack")) chips.push("高风险");
      if (!intent.tags.includes("rest")) chips.push(`行动力 ${intent.mpCost}`);
      chips.push(ACTION_TIER_LABELS[intent.actionTier] || "推进");
      if (intent.targets.length) chips.push(`接触 ${intent.targets.map((id) => ENTITIES[id].short).join(" / ")}`);
      if (intent.location?.name) chips.push(intent.location.name);
      if (module?.branchClass) chips.push(describeBranchClass(module.branchClass));
      if (module?.urgency) chips.push(`紧迫 ${module.urgency}/5`);
    }
    const proseLine = compactRoute ? "" : buildOptionFlavorLine(roleId, slotId, module, intent);
    const focusLabel = compactRoute || !module ? "" : formatFocusLabel(module.focus);
    return `
      <button class="option-card ${disabled ? "disabled" : ""} ${restedThisSlot ? "rest-locked" : ""} ${exhausted && intent.tags.includes("rest") ? "rest-ready" : ""}" data-action="choose-option" data-option="${key}" ${disabled ? "disabled" : ""}>
        <div class="option-top">
          <strong>${key}</strong>
          <span>${restedThisSlot ? "已休息" : exhausted && intent.tags.includes("rest") ? "唯一可选" : compactRoute ? `行动力 ${intent.mpCost}` : `行动力 ${intent.mpCost}`}</span>
        </div>
        <p>${compactLabel}</p>
        ${focusLabel ? `<div class="archive-meta">${focusLabel}</div>` : ""}
        ${proseLine ? `<div class="archive-meta">${proseLine}</div>` : ""}
        ${reason ? `<div class="archive-meta danger">${reason}</div>` : ""}
        ${chips.length ? `<div class="tag-row">${chips.map((chip) => `<span class="small-pill">${chip}</span>`).join("")}</div>` : ""}
      </button>
    `;
  }

  function buildOptionFlavorLine(roleId, slotId, module, intent) {
    if (!module) return "";
    if (roleId === "yamada" || roleId === "fan" || roleId === "debora" || roleId === "ziche") return "";
    const motifs = new Set(module.motifs || []);
    if (motifs.has("rest")) {
      return ensureSecondPersonChoice(roleId === "fan"
        ? "停下来，让痛苦暂时拥有能被祈祷承受的名字"
        : roleId === "ziche"
          ? "停下来，用静止换一轮更清楚的动静判断"
          : roleId === "yamada"
            ? "停下来，确认面具、语气和破绽都还压得住"
            : roleId === "anjie"
              ? "停下来，让逻辑、时间线和怀疑重新排队"
              : roleId === "debora"
                ? "停下来，先把旧账、疲态和求生本能压回壳里"
                : "停下来，等回声、亡者或门后的东西先开口");
    }
    if (motifs.has("generator")) return ensureSecondPersonChoice("把电力、门闩、密码与逃生节奏重新抢回手里");
    if (motifs.has("weapon")) return ensureSecondPersonChoice("让器具、陷阱和处理手段先于情绪说话");
    if (motifs.has("vote")) return ensureSecondPersonChoice("提前把怀疑、立场与票向推到无法装糊涂的位置");
    if (motifs.has("corpse")) return ensureSecondPersonChoice("从死亡边上捞出可被追责、也会反咬人的痕迹");
    if (motifs.has("ritual")) return ensureSecondPersonChoice(roleId === "patrick" ? "顺着禁忌、亡者与回声往更深的真相下潜" : "翻开象征、隐喻与旧仪式背后那层更难听的解释");
    if (motifs.has("alliance")) return ensureSecondPersonChoice("把关系从试探、借力一步步推向站队与共担后果");
    if (motifs.has("escape")) return ensureSecondPersonChoice("先替最后的出口、断后点和取舍顺序摸清轮廓");
    if (motifs.has("sacrifice")) return ensureSecondPersonChoice("提前靠近那个代价最大、也最容易要命的答案");
    if (motifs.has("pressure")) return ensureSecondPersonChoice("把对话逼到不能再靠礼貌、沉默或借口含糊过去");
    if (motifs.has("care")) return ensureSecondPersonChoice("用靠近、安抚和试探去测信任到底能承多久");
    if (motifs.has("surveillance")) return ensureSecondPersonChoice("先看清谁在观察、谁在躲、谁在等别人先失手");
    if (intent.targets.length) return ensureSecondPersonChoice(`把这一步直接压到${intent.targets.map((id) => ENTITIES[id].short).join(" / ")}身上，看反应先裂哪一层`);
    return "";
  }

  function renderSceneResult() {
    const scene = state.scene;
    if (!scene || !Array.isArray(scene.paragraphs)) {
      return `
        <section class="panel narrative-panel">
          <div class="notice-box">
            <strong>结果页已回退</strong>
            <span>这个存档缺少本时段结果文本，系统已阻止白屏。你可以直接回到本时段开头重新选择。</span>
          </div>
          <div class="footer-actions">
            <button class="btn primary" data-action="recover-decision">返回本时段选择</button>
            <button class="btn" data-action="back-title">返回标题</button>
          </div>
        </section>
      `;
    }
    const isPatrick = state.selectedRole === "patrick";
    const isAnjie = state.selectedRole === "anjie";
    const compactRoute = COMPACT_RESULT_ROUTE_IDS.has(state.selectedRole);
    const routePaged = PAGED_ROUTE_IDS.has(state.selectedRole);
    const resultPages = isPatrick
      ? getPatrickResultPages(scene)
      : isAnjie
        ? getAnjieResultPages(scene)
        : routePaged
          ? getPagedResultPages(scene, state.selectedRole)
          : [state.fast ? scene.paragraphs.slice(0, 2) : scene.paragraphs];
    const pageIndex = clamp(Number(state.scenePage || 0), 0, Math.max(0, resultPages.length - 1));
    const shownParagraphs = resultPages[pageIndex] || [];
    const hasMorePages = routePaged && resultPages.length > 1 && pageIndex < resultPages.length - 1;
    const showQuote = !routePaged || !hasMorePages;
    const heavyInjury = isHeavyInjury(state);
    const sanState = getSanState(state);
    const summaryText = isDead(state)
      ? "你已经撑不过下一步了。"
      : isInsane(state)
        ? "理智已经断开，之后不会再有正常的判断。"
        : heavyInjury
      ? "剧痛压着每一步，结果只剩下还能不能继续。"
      : sanState === "truth"
        ? `你看见真实，${getTruthTierLabel(state.stats.truth)}。`
        : sanState === "insight"
          ? "你已经开始分不清回声和警告。"
          : "这一步留下了后续回响。";
    const summaryChips = [];
    const effectReasons = buildEffectReasonSummary(scene.effects || { stats: {}, relations: {}, notes: [] });
    const effectBreakdown = buildEffectBreakdown(scene.effects || { stats: {}, relations: {}, relationEchoes: {}, notes: [], addWords: [], addClues: [], addItems: [] });
    const outcomeSignals = buildOutcomeSignals(scene.effects || { stats: {}, relations: {}, relationEchoes: {}, notes: [], addWords: [], addClues: [], addItems: [] }, state);
    const nextStepWarnings = buildNextStepWarnings(scene.effects || { stats: {}, relations: {}, relationEchoes: {}, notes: [], addWords: [], addClues: [], addItems: [] }, state);
    const lowSanEcho = buildLowSanEcho(state, "result", scene.slotId);
    const compactAnjieMeta = isAnjie ? renderAnjieCompactResultSummary(effectBreakdown, nextStepWarnings) : "";
    const compactRouteMeta = !isAnjie && compactRoute
      ? renderCompactRouteResultSummary(effectBreakdown, nextStepWarnings, effectReasons)
      : "";
    const headChipLimit = isAnjie ? 4 : 6;
    if (heavyInjury) summaryChips.push("重伤", "短句压缩");
    if (isDead(state)) summaryChips.push("HP 归零");
    if (isInsane(state)) summaryChips.push("SAN 归零");
    if (state.stats.mp <= 0) summaryChips.push("只剩休息");
    if (Number(state.stats.san || 0) < SAN_VISUAL_THRESHOLD) summaryChips.push("低理智");
    if (sanState === "truth") summaryChips.push("看见真实");
    return `
      <section class="panel narrative-panel">
        <div class="result-head">
          <div>
            <div class="eyebrow">本时段结果</div>
            <h2>${scene.slotId} · ${scene.cleanLabel}</h2>
            <p>${scene.location.name} · ${scene.encounter?.short || "无明确目标相遇"}</p>
          </div>
          <div class="tag-row">${scene.effectChips.slice(0, headChipLimit).map((chip) => `<span class="tag-pill">${chip}</span>`).join("")}</div>
        </div>
        <div class="notice-box result-summary ${heavyInjury ? "heavy" : ""} ${sanState === "truth" ? "truth" : ""} ${isLowSan(state) ? "low-san-hint" : ""}">
          <strong>结算</strong>
          <span>${summaryText}${isAnjie && compactAnjieMeta ? ` ${escapeHtml(compactAnjieMeta)}` : ""}</span>
          ${summaryChips.length ? `<div class="tag-row">${summaryChips.map((chip) => `<span class="small-pill">${chip}</span>`).join("")}</div>` : ""}
          ${compactRouteMeta || (!isAnjie && effectReasons.length ? `<div class="effect-reasons">${effectReasons.map((line) => `<div>${escapeHtml(line)}</div>`).join("")}</div>` : "")}
          ${lowSanEcho ? `<span class="san-echo">${escapeHtml(lowSanEcho)}</span>` : ""}
        </div>
        ${isAnjie || compactRoute ? "" : renderOutcomeSignals(outcomeSignals)}
        ${isAnjie || compactRoute ? "" : renderNextStepWarnings(nextStepWarnings)}
        ${isAnjie || compactRoute ? "" : renderEffectBreakdown(effectBreakdown)}
        <div class="story-text">
          ${shownParagraphs.map((paragraph) => `<p>${escapeHtml(compressTextByState(paragraph, state))}</p>`).join("")}
          ${hasMorePages ? `<div class="notice-box result-pager"><strong>继续阅读</strong><span>本段尚未结束，按【继续】查看剩余内容。</span></div>` : ""}
          ${showQuote ? `<blockquote>${escapeHtml(compressTextByState(scene.quote, state))}</blockquote>` : ""}
        </div>
        ${isAnjie || compactRoute ? "" : `<div class="effect-wrap">
          ${scene.effectChips.map((chip) => `<span class="tag-pill">${chip}</span>`).join("")}
        </div>`}
        ${routePaged && resultPages.length > 1 ? `<div class="result-pager"><span>第 ${pageIndex + 1} / ${resultPages.length} 页</span><span>${hasMorePages ? "【继续】" : "已读完本段"}</span></div>` : ""}
        <div class="footer-actions">
          <button class="btn primary" data-action="continue-slot">${hasMorePages ? "【继续】" : state.slotIndex === SLOT_ORDER.length - 1 ? "结算结局" : "进入下一时段"}</button>
          <button class="btn" data-action="open-log">查看日志</button>
        </div>
      </section>
    `;
  }

  function buildEndingRecap(currentState = state, outcome = currentState.outcome || determineOutcome(currentState)) {
    const score = evaluateEndingScore(currentState.selectedRole, currentState);
    const understood = [];
    const missed = [];
    const next = [];
    if (currentState.generators?.progress >= 4) understood.push("你已经证明：逃生不是只靠勇气，至少需要把发电机、密码和同伴行动接起来。");
    else missed.push("物理逃生链仍然断裂：发电机进度不足会压过大多数剧情判断。");
    if (Number(currentState.stats?.truth || 0) >= 58 || score.canon >= 8) understood.push("你抓住了足够多的规则碎片，已经能解释疗养院为什么反复吞人。");
    else missed.push("真相线索仍偏散，下一次优先选择调查、记录、追问和复盘类行动。");
    if (outcome.scope === "special") understood.push("这次结局来自角色自身的选择逻辑：关系、证据和关键经历共同成立。");
    else next.push("若想进入个人特殊结局，别只盯一个数值：同时补证据、关键关系和角色里程碑。");
    if (Number(currentState.stats?.san || 0) < 34) missed.push("SAN 已经很低，很多真相会被污染成循环；休息和内心整理现在更有价值。");
    if (isHeavyInjury(currentState)) missed.push("身体状态拖住了终局执行，重伤后继续硬闯会让好结局变窄。");
    if (!next.length) next.push("可以尝试换一种立场：更公开地结盟、更克制地调查，或把最后选择交给角色直觉。");
    return {
      understood: understood.slice(0, 3),
      missed: missed.slice(0, 3),
      next: next.slice(0, 2),
      score,
    };
  }

  function renderEndingRecap(currentState = state, outcome = currentState.outcome || determineOutcome(currentState)) {
    const recap = buildEndingRecap(currentState, outcome);
    const scoreLine = `特殊评分 ${Object.values(recap.score.scores || {})[0] || 0} / 原作倾向 ${recap.score.canon}`;
    const renderList = (items) => items.length ? items.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>本次没有明显缺口，差异主要来自终局选择。</li>";
    return `
      <section class="ending-recap">
        <div class="archive-meta">v1.2 复盘 · ${escapeHtml(scoreLine)}</div>
        <div class="ending-recap-grid">
          <div><h3>你理解了什么</h3><ul>${renderList(recap.understood)}</ul></div>
          <div><h3>你错过了什么方向</h3><ul>${renderList(recap.missed)}</ul></div>
          <div><h3>下一次可以尝试</h3><ul>${renderList(recap.next)}</ul></div>
        </div>
      </section>
    `;
  }

  function renderEnd() {
    const role = currentRole();
    const outcome = state.outcome || determineOutcome();
    const endingChecks = outcome.checks?.length ? outcome.checks : buildEndingChecks(state, outcome);
    const meta = loadMeta();
    return `
      <section class="frame page-shell">
        <div class="topbar">
          <div>
            <h1>${outcome.title}</h1>
            <p>${role.name} 的二阶线路已完成。本次结局取决于发电机、关系、投票与终局阶段的处理方式。</p>
          </div>
          <div class="title-tags">
            <span class="tag-pill">${role.name}</span>
            <span class="tag-pill">${outcome.scope === "special" ? "个人特殊结局" : "通用结局"}</span>
            <span class="tag-pill">${state.flags.voteOutcome || "未公开票型"}</span>
            <span class="tag-pill">发电机 ${state.generators.progress} / 4</span>
          </div>
        </div>
        <div class="ending-layout">
          <section class="panel ending-main">
            <h2>${role.name}</h2>
            <p>${compressTextByState(outcome.text, state)}</p>
            ${renderEndingChecks(endingChecks)}
            ${renderEndingRecap(state, outcome)}
            <div class="detail-line"><strong>终局摘要</strong><span>真相 ${state.stats.truth} / ${getTruthTierLabel(state.stats.truth)} / 发电机 ${state.generators.progress} / 4</span></div>
            <div class="detail-line"><strong>判定结果</strong><span>${outcome.scope === "special" ? "个人特殊结局" : "通用结局"} · ${outcome.note || outcome.title}</span></div>
            <div class="detail-line"><strong>投票结果</strong><span>${state.exiledByVote ? "你被投票放逐" : (state.voteDeaths.length ? state.voteDeaths.map((id) => ENTITIES[id]?.name || id).join(" / ") : "未记录")}</span></div>
            <div class="detail-line"><strong>隐藏档案</strong><span>${role.archive.role} · ${role.archive.ability}</span></div>
          </section>
          <section class="panel">
            <h2>尾声补充</h2>
            <p>${role.archive.truth}</p>
            <div class="detail-line"><strong>全局进度</strong><span>已完成 ${meta.completedRoles.length} / ${PLAYABLE_ROLE_IDS.length} 名主角线路</span></div>
            <div class="detail-line"><strong>真相路线</strong><span>${meta.truthRouteUnlocked ? "埃莉诺文件夹已解锁" : "完成 6 名主角线路后解锁"}</span></div>
            <div class="footer-actions">
              ${meta.truthRouteUnlocked ? `<button class="btn primary" data-action="open-truth">${meta.truthRouteCompleted ? "重读真相路线" : "进入真相路线"}</button>` : ""}
              <button class="btn primary" data-action="archive">查看全部档案</button>
              <button class="btn" data-action="restart-role" data-role="${role.id}">重开该角色</button>
              <button class="btn" data-action="back-title">返回标题</button>
            </div>
          </section>
        </div>
      </section>
    `;
  }

  function renderOverlay() {
    if (!state.overlay) return "";
    if (state.overlay === "log") return renderLogOverlay();
    if (state.overlay === "save") return renderSaveOverlay();
    return "";
  }

  function renderLogOverlay() {
    return `
      <section class="modal">
        <div class="modal-card">
          <div class="modal-head">
            <div>
              <div class="eyebrow">回看日志</div>
              <h2>本轮记录 ${state.log.length} 条</h2>
            </div>
            <button class="btn" data-action="close-overlay">关闭</button>
          </div>
          <div class="modal-body">
            <div class="log-list">
              ${state.log.length
                ? state.log
                    .map(
                      (item, index) => `
                        <details class="log-entry" ${index === state.log.length - 1 ? "open" : ""}>
                          <summary>${item.title}</summary>
                          <p>${escapeHtml(item.text).replace(/\n/g, "<br />")}</p>
                        </details>
                      `,
                    )
                    .join("")
                : `<div class="log-entry"><summary>暂无记录</summary><p>还没有进入任何时段结果。</p></div>`}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderSaveOverlay() {
    const slots = loadSlots();
    return `
      <section class="modal">
        <div class="modal-card">
          <div class="modal-head">
            <div>
              <div class="eyebrow">手动存档</div>
              <h2>3 个可用槽位</h2>
            </div>
            <button class="btn" data-action="close-overlay">关闭</button>
          </div>
          <div class="modal-body">
            <div class="save-grid">
              ${[1, 2, 3]
                .map((slot) => {
                  const entry = slots[slot];
                  const savedRole = entry?.selectedRole && ROLE_DEFS[entry.selectedRole] ? ROLE_DEFS[entry.selectedRole] : null;
                  const title = savedRole ? `${savedRole.name} · ${SLOT_ORDER[entry.slotIndex || 0]}` : "空槽";
                  return `
                    <section class="panel save-card">
                      <h3>槽位 ${slot}</h3>
                      <p>${title}</p>
                      <div class="archive-meta">${entry?.savedAt || "尚未保存"}</div>
                      <div class="footer-actions">
                        <button class="btn primary" data-action="save-slot" data-slot="${slot}">保存到此处</button>
                        <button class="btn" data-action="load-slot" data-slot="${slot}" ${entry ? "" : "disabled"}>读取</button>
                      </div>
                    </section>
                  `;
                })
                .join("")}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function saveSlot(slot) {
    const slots = loadSlots();
    slots[slot] = {
      ...state,
      savedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    };
    saveSlots(slots);
    state.overlay = "save";
    persist();
    render();
  }

  function loadSlot(slot) {
    const slots = loadSlots();
    if (!slots[slot]) return;
    state = normalizeState(slots[slot]);
    state.overlay = null;
    state.screen = state.selectedRole ? (state.finished ? "end" : "game") : "title";
    persist();
    render();
  }

  function recoverDecisionState() {
    state.phase = "decision";
    state.scene = null;
    state.scenePage = 0;
    state.overlay = null;
    state.notice = state.notice || "已回退到本时段开始前。";
    persist();
    render();
  }

  function renderRecoveryPanel() {
    return `
      <section class="frame page-shell fatal-shell">
        <section class="panel fatal-card">
          <div class="eyebrow">状态恢复</div>
          <h1>当前存档无法直接进入剧情页</h1>
          <p>系统已拦截本次渲染，避免显示空白页面。通常这意味着旧版存档缺少角色、时段或结果页数据。</p>
          <div class="bullet-list">
            <div>你可以返回标题重新进入角色线路。</div>
            <div>如果只是旧版结果页数据缺失，也可以尝试回退到本时段选择。</div>
          </div>
          <div class="footer-actions">
            <button class="btn primary" data-action="recover-decision">回到本时段选择</button>
            <button class="btn" data-action="back-title">返回标题</button>
          </div>
        </section>
      </section>
    `;
  }

  function renderFatal(error, notes = []) {
    const detail = [
      ...notes,
      error?.message ? `错误信息：${error.message}` : "",
    ]
      .filter(Boolean)
      .map((line) => `<div>${escapeHtml(line)}</div>`)
      .join("");
    app.innerHTML = `
      <section class="frame page-shell fatal-shell">
        <section class="panel fatal-card">
          <div class="eyebrow">启动保护</div>
          <h1>页面已停止渲染，避免白屏</h1>
          <p>当前版本已经启用首屏保护。只要检测到故事数据缺失或旧存档状态异常，就会显示这个面板，而不是让界面静默崩溃。</p>
          <div class="bullet-list">${detail || "<div>没有更多可显示的错误细节。</div>"}</div>
          <div class="footer-actions">
            <button class="btn primary" data-action="back-title">返回标题</button>
          </div>
        </section>
      </section>
    `;
  }

  function toggleFast() {
    state.fast = !state.fast;
    persist();
    render();
  }

  function toggleSound() {
    state.sound = !state.sound;
    persist();
    render();
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function ensureAudio() {
    if (!state.sound) return null;
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function beep(freq = 660, duration = 0.05, type = "triangle", gainValue = 0.015) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = gainValue;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  }

  app.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    if (button.disabled) return;
    beep();
    switch (action) {
      case "start":
        startNew();
        break;
      case "resume":
        resumeLast();
        break;
      case "archive":
        pauseEpilogueAudio();
        state.screen = "archive";
        state.overlay = null;
        persist();
        render();
        break;
      case "manual-unlock-truth":
        manualUnlockTruthRoute();
        break;
      case "open-truth":
        openTruthRoute();
        break;
      case "open-epilogue":
        openEpilogue();
        break;
      case "open-truth-collection":
        openTruthCollection(button.dataset.collection);
        break;
      case "truth-index":
        backTruthIndex();
        break;
      case "truth-prev":
        stepTruthPage(-1);
        break;
      case "continue-truth":
        continueTruthRoute();
        break;
      case "speed-epilogue":
        speedEpilogueScroll();
        break;
      case "next-epilogue":
        nextEpilogueAct();
        break;
      case "toggle-epilogue-audio":
        toggleEpilogueAudio();
        break;
      case "complete-truth":
        completeTruthRoute();
        break;
      case "back-title":
        resetToTitle();
        break;
      case "pick-role":
        if (button.dataset.role && CHARACTER_PRESENTATION[button.dataset.role]) {
          const roleId = button.dataset.role;
          if (isCoarsePointer()) {
            if (titleTouchArmedRoleId === roleId && titlePreviewRoleId === roleId) {
              openPresentationRole(roleId);
            } else {
              titleTouchArmedRoleId = roleId;
              setTitlePreview(roleId);
            }
          } else {
            openPresentationRole(roleId);
          }
        }
        break;
      case "begin-role":
        beginRole(button.dataset.role);
        break;
      case "restart-role":
        beginRole(button.dataset.role);
        break;
      case "choose-option":
        chooseOption(button.dataset.option);
        break;
      case "continue-slot":
        continueSlot();
        break;
      case "undo-choice":
        undoLastChoice();
        break;
      case "view-ending-gallery":
        state.galleryEnding = { roleId: button.dataset.role, key: button.dataset.ending };
        persist();
        render();
        break;
      case "open-log":
        state.overlay = "log";
        persist();
        render();
        break;
      case "open-save":
        state.overlay = "save";
        persist();
        render();
        break;
      case "close-overlay":
        state.overlay = null;
        persist();
        render();
        break;
      case "save-slot":
        saveSlot(button.dataset.slot);
        break;
      case "load-slot":
        loadSlot(button.dataset.slot);
        break;
      case "toggle-fast":
        toggleFast();
        break;
      case "toggle-sound":
        toggleSound();
        break;
      case "recover-decision":
        recoverDecisionState();
        break;
      default:
        break;
    }
  });

  app.addEventListener("input", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || !target.matches("[data-epilogue-audio-progress]")) return;
    epilogueAudioSeeking = true;
    seekEpilogueAudio(target.value);
  });

  app.addEventListener("change", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || !target.matches("[data-epilogue-audio-progress]")) return;
    seekEpilogueAudio(target.value);
    epilogueAudioSeeking = false;
    syncEpilogueAudioUi();
  });

  app.addEventListener("pointerdown", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || !target.matches("[data-epilogue-audio-progress]")) return;
    epilogueAudioSeeking = true;
    epilogueAudioSeekControl = target;
    seekEpilogueAudioFromPointer(target, event);
    if (typeof target.setPointerCapture === "function") {
      target.setPointerCapture(event.pointerId);
    }
  });

  app.addEventListener("pointermove", (event) => {
    if (!epilogueAudioSeeking || !epilogueAudioSeekControl) return;
    seekEpilogueAudioFromPointer(epilogueAudioSeekControl, event);
  });

  app.addEventListener("pointerup", (event) => {
    if (!epilogueAudioSeeking || !epilogueAudioSeekControl) return;
    seekEpilogueAudioFromPointer(epilogueAudioSeekControl, event);
    epilogueAudioSeeking = false;
    epilogueAudioSeekControl = null;
    syncEpilogueAudioUi();
  });

  app.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || !target.matches("[data-epilogue-audio-progress]")) return;
    seekEpilogueAudioFromPointer(target, event);
    epilogueAudioSeeking = false;
    epilogueAudioSeekControl = null;
    syncEpilogueAudioUi();
  }, true);

  app.addEventListener("wheel", (event) => {
    const target = event.target instanceof Element ? event.target.closest("[data-epilogue-scroll-window]") : null;
    if (!target) return;
    pauseEpilogueTextAutoScroll(target);
  }, true);

  app.addEventListener("scroll", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || !target.matches("[data-epilogue-scroll-window]")) return;
    pauseEpilogueTextAutoScroll(target);
  }, true);

  app.addEventListener("pointerdown", (event) => {
    const target = event.target instanceof Element ? event.target.closest("[data-epilogue-scroll-window]") : null;
    if (!target) return;
    pauseEpilogueTextAutoScroll(target);
  }, true);

  app.addEventListener("touchstart", (event) => {
    const target = event.target instanceof Element ? event.target.closest("[data-epilogue-scroll-window]") : null;
    if (!target) return;
    pauseEpilogueTextAutoScroll(target);
  }, true);

  window.addEventListener("keydown", (event) => {
    const hotspot = event.target instanceof Element ? event.target.closest("[data-title-hotspot='true']") : null;
    if (hotspot && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      const roleId = hotspot.getAttribute("data-role");
      if (roleId) openPresentationRole(roleId);
      return;
    }
    if (event.key === "Escape") {
      if (state.overlay) {
        state.overlay = null;
        persist();
        render();
      } else {
        resetToTitle();
      }
    }
    if (state.screen === "game" && state.phase === "result" && (event.key === " " || event.key === "Enter")) {
      event.preventDefault();
      continueSlot();
    }
  });

  app.addEventListener("mouseover", (event) => {
    if (state.screen !== "title" || isCoarsePointer()) return;
    const hotspot = event.target.closest("[data-title-hotspot='true']");
    if (!hotspot) return;
    const roleId = hotspot.getAttribute("data-role");
    if (roleId && roleId !== titlePreviewRoleId) {
      titleTouchArmedRoleId = null;
      setTitlePreview(roleId);
    }
  });

  app.addEventListener("pointerover", (event) => {
    if (state.screen !== "title" || isCoarsePointer()) return;
    const hotspot = event.target.closest("[data-title-hotspot='true']");
    if (!hotspot) return;
    const roleId = hotspot.getAttribute("data-role");
    if (roleId && roleId !== titlePreviewRoleId) {
      titleTouchArmedRoleId = null;
      setTitlePreview(roleId);
    }
  });

  app.addEventListener("focusin", (event) => {
    if (state.screen !== "title") return;
    const hotspot = event.target.closest("[data-title-hotspot='true']");
    if (!hotspot) return;
    const roleId = hotspot.getAttribute("data-role");
    if (roleId && roleId !== titlePreviewRoleId) {
      titleTouchArmedRoleId = null;
      setTitlePreview(roleId);
    }
  });

  app.addEventListener("mouseout", (event) => {
    if (state.screen !== "title" || isCoarsePointer()) return;
    if (titlePreviewLockUntil && Date.now() < titlePreviewLockUntil) return;
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const shell = target.closest("[data-title-shell]");
    if (!shell) return;
    const related = event.relatedTarget instanceof Element ? event.relatedTarget.closest("[data-title-shell]") : null;
    if (!related) {
      setTitlePreview(null);
    }
  }, true);

  app.addEventListener("pointerdown", (event) => {
    if (state.screen !== "title" || !isCoarsePointer()) return;
    const hotspot = event.target.closest("[data-title-hotspot='true']");
    const shell = event.target.closest("[data-title-shell]");
    const previewBand = event.target.closest("[data-title-preview-band]");
    if (!hotspot && !previewBand && !shell) {
      setTitlePreview(null);
    } else if (!hotspot && shell && !previewBand) {
      setTitlePreview(null);
    }
  });

  window.__shepherd = {
    getState: () => structuredClone(state),
    chooseOption,
    continueSlot,
    beginRole,
    getSlotOptions: (roleId, slotId) => {
      const role = roleId || state.selectedRole;
      const slot = slotId || currentSlotId();
      const options = getRoleOptions(role, slot);
      return Object.fromEntries(
        Object.entries(options).map(([key, label]) => {
          const intent = analyzeChoice(label, key, slot, role);
          return [key, {
            label,
            intent,
            disabledReason: getOptionDisabledReason(state, slot, intent),
          }];
        }),
      );
    },
    previewOptionEffects: (roleId, slotId, optionKey) => {
      const role = roleId || state.selectedRole;
      const slot = slotId || currentSlotId();
      const key = optionKey;
      const options = getRoleOptions(role, slot);
      const label = options?.[key];
      if (!label) return null;
      const intent = analyzeChoice(label, key, slot, role);
      const draft = structuredClone(state);
      draft.selectedRole = role;
      const encounterId = chooseEncounter(role, slot, intent, draft);
      const effects = buildEffects(role, slot, intent, draft, encounterId);
      return structuredClone({
        encounterId,
        intent,
        effects,
        reasons: buildEffectReasonSummary(effects),
        breakdown: buildEffectBreakdown(effects),
      });
    },
    toggleFast,
    loadSlot,
    saveSlot,
    evaluateOutcome: () => structuredClone(determineOutcome()),
    evaluateOutcomeForState: (nextState) => structuredClone(determineOutcome(normalizeState(nextState))),
    evaluateEndingScore: (roleId = state.selectedRole) => structuredClone(evaluateEndingScore(roleId, state)),
    evaluateEndingScoreForState: (roleId, nextState) => {
      const normalized = normalizeState(nextState || state);
      return structuredClone(evaluateEndingScore(roleId || normalized.selectedRole, normalized));
    },
    evaluateCanonScore: (roleId = state.selectedRole) => evaluateCanonScore(roleId, state),
    getMeta: () => structuredClone(loadMeta()),
    setMeta: (nextMeta) => {
      const meta = normalizeMeta(nextMeta);
      saveMeta(meta);
      state.archive = syncArchiveWithMeta(state.archive);
      persist();
      render();
      return structuredClone(meta);
    },
    openTruthRoute,
    continueTruthRoute,
    setState: (nextState) => {
      state = normalizeState(nextState);
      persist();
      render();
    },
  };

  function renderAnjieCompactResultSummary(breakdown = { costs: [], gains: [], risks: [] }, warnings = []) {
    const parts = [];
    const pushPart = (label, items, limit = 1) => {
      const normalized = (items || []).filter(Boolean).slice(0, limit);
      if (!normalized.length) return;
      parts.push(`${label}：${normalized.join(" / ")}`);
    };
    pushPart("代价", breakdown.costs, 1);
    pushPart("收获", breakdown.gains, 1);
    pushPart("余波", breakdown.risks, 1);
    pushPart("下一步", warnings, 1);
    return parts.slice(0, 3).join("；");
  }

  render();
})();
