(() => {
  const getEntities = () => window.SHEPHERD_STORY_DATA?.entities || {};

  function getTarget(encounterId) {
    if (!encounterId) return "";
    return getEntities()[encounterId]?.short || "";
  }

  function buildAnjieSlotStageLines(slotId, stage, draftState, encounterId) {
    const lines = [];
    const target = getTarget(encounterId);
    const patrickTrust = draftState.relations.patrick || 0;
    const emilyTrust = draftState.relations.emily || 0;
    const karlSuspicion = draftState.suspicion?.player?.karl || 0;
    const clueCount = draftState.clues.length;
    if (stage === "opening") {
      if (slotId === "1.1") lines.push("刚醒来的前一刻，你还像被人随手扔进一页撕裂的梦里；下一刻，你已经逼着自己先去确认物件、出口和他人的站位。你怕的不是陌生本身，而是在你还没把秩序拼回手里之前，别人已经先根据你的慌乱替你定了性。");
      else if (slotId === "1.2") lines.push("大厅第一次把九个人同时摆到你面前时，你几乎是本能地开始替每个人编号。谁先抢答，谁故作平静，谁在听到规则后接受得太快，这些都被你默默压进第一轮样本里，因为后面的每一次翻供都要回头拿它们对照。");
      else if (slotId === "2.3") lines.push("发电机、密码和线缆给了你一种近乎奢侈的慰藉。它们至少还服从步骤，不会像人那样临场变脸，也不会像噩梦那样把因果顺序整段篡改，所以你忍不住把一部分希望先压在机械逻辑上。");
      else if (slotId === "2.4") lines.push("第二次聚集开始以后，你带回人群的已经不只是零散线索，而是一整套尚未闭合的推理骨架。麻烦正在于此。你既要让别人接受结论，又不能让他们过早看清你真正依赖的判断路径。");
      else if (slotId === "3.3") lines.push("梅露露的死把你最倚赖的时间轴钉上了一具尸体。推理从解释异常，变成追问每次犹豫、安抚和错过有没有参与死因。");
      else if (slotId === "4.4") lines.push("到了投票这一刻，你必须把‘怀疑’写成‘指向’。纸面只落下一枚名字，真正落下去的却是你此前所有观察的排序。");
      else if (slotId === "5.1") lines.push("派翠克的觉醒像一记砸在逻辑表面的重击。你看见‘人’和‘容器’的边界裂开时，仍本能地想抓住还能命名和分类的东西。");
      else if (slotId === "5.3" || slotId === "5.4") lines.push("白门近在眼前后，推理第一次不再只指向真相，而是指向取舍。剩下的问题已不是门能不能开，而是开门后该带走谁、留下谁。");
      if (draftState.flags.meruruBlessing && ["3", "4", "5"].includes(slotId[0])) lines.push("梅露露先前留给你的那点异常温柔没有让事情变简单，反而让你在后续判断里多背了一层重量。你开始无法把她单纯写成证人或受害者，这让你的每一次归类都比之前更慢半拍。");
      if (patrickTrust >= 14 && ["4", "5"].includes(slotId[0])) lines.push("更糟的是，你已经没法把派翠克彻底当作待检验对象。那份逐渐成形的信任像一枚危险的修正项卡在推理里，让你每次想到她时，都不得不额外追问自己一次：这是证据，还是偏爱。");
      if (karlSuspicion >= 20 && slotId !== "1.1") lines.push("卡尔的名字也越来越难从你的笔记边角被擦掉。你甚至能提前听见他的音量和立场如何闯进来，把原本还能细拆慢看的局面重新推向粗暴的结论。");
    }
    if (stage === "encounter") {
      if (slotId === "1.2" && target) lines.push(`第一次集体会面里的任何一句客套都不轻。你和${target}此刻交换的不只是表情和口风，而是各自愿意在众目睽睽下先交出多少破绽。`);
      if (slotId === "3.3" && target) lines.push(`到了梅露露死去的这一刻，你再看${target}时，已经很难只把对方当成活着的证人。死者刚留出的空位像新伤，逼得所有人的反应都更接近本能。`);
      if (slotId === "4.4" && target) lines.push(`投票前后的对视更像提前落笔。你会不自觉估算${target}一句解释、一秒迟疑或一次回避，在纸面上会被翻成支持、弃权，还是指向谁。`);
      if (encounterId === "patrick" && patrickTrust >= 12) lines.push("你最讨厌和她对话时自己会额外谨慎这一点。那意味着你已经不再满足于拆穿她，更在隐秘地担心自己误判她。对一个侦探而言，这几乎和暴露弱点没有区别。");
      if (encounterId === "karl" && (karlSuspicion >= 20 || draftState.flags.karlExposed)) lines.push("卡尔如今每多说一句，你都会自动去比对他之前哪一次失态、哪一次抢先定义局势、哪一次把暴烈包装成负责。你几乎能感觉到他正在失去对自己叙事的垄断，而这恰恰是最危险的阶段。");
      if (encounterId === "emily" && draftState.flags.meruruDead && emilyTrust >= 0) lines.push("梅露露死后再面对艾米莉时，你会更克制地压低语速。你知道她的惊惶里混着太多未经整理的目击内容，稍微追急一点，就可能把还能用的证言彻底搅碎。");
    }
    if (stage === "outcome") {
      if (slotId === "2.4") lines.push("从第二次聚集起，线索第一次被迫从你的私人笔记走向公共桌面。你得到的进展因此更完整，却也更危险，因为别人终于有机会直接审视你推理的方法本身。");
      if (slotId === "3.3") lines.push("一旦时间线里正式出现尸体，很多原本还能被称作误会的东西都会失去缓冲。你再写下任何结论时，纸面后面都站着一个撤不回的死亡结果。");
      if (slotId === "4.4") lines.push("这一步最沉的后果不在于你看见了什么，而在于你必须承认自己愿意让哪一种怀疑先变成现实。票一落下，逻辑就带上了共犯色。");
      if (slotId === "5.1") lines.push("派翠克的异变把你一直倚赖的分类法推进死角。你不得不承认，有些东西即使准确命名出来，也不会更可控；有些真相是在被命名后才开始吞人。");
      if (slotId === "5.3" || slotId === "5.4") lines.push("门前阶段的收获几乎都自带反噬。每多掌握一点出口条件，你就得更早决定谁能跟上、谁会掉队。");
      if (draftState.flags.karlExposed && slotId.startsWith("4.")) lines.push("卡尔身上那道已经被撬开的裂口也在这里继续发挥作用。你很清楚，只要再有一点足够硬的推力，他此前强行垄断的正义姿态就会开始反咬他自己。");
      if (patrickTrust >= 14 && ["4", "5"].includes(slotId[0])) lines.push("只是当结论一路延伸到派翠克身边时，你还是会比平时多停一瞬。那一瞬很短，却足够说明你已经把她放进了会影响最终判断的人名列表里。");
      if (clueCount >= 4 && slotId.startsWith("4.")) lines.push("手里的记录越写越厚以后，你反而更难获得安定。因为当线索已经足够多却仍然不能自动拼出唯一答案时，真正可怕的往往不是信息不足，而是有人一直在有意识地喂给你错误的顺序。");
    }
    if (stage === "ripple") {
      if (slotId === "2.4") lines.push("从这次开始，你再也不能假装某些判断只属于自己。每个参与者都已经看见了你递出去的其中一部分逻辑，因此之后不论谁反驳你、借用你，还是沿着你的话继续走，都会比先前更有杀伤力。");
      if (slotId === "3.4" || slotId.startsWith("4.")) lines.push("投票真正开始之前，很多票型其实已经在这些相遇和辩论碎片里长成了雏形。你知道自己后面必须为此不断回头校正，也知道未必每一次都来得及。");
      if (slotId === "5.1") lines.push("你隐约明白，自己往后很难再回到那种‘只要耐心搜集证据，一切终能解释’的安全感里了。派翠克撕开的不是单个谜面，而是你处理整场噩梦的方法。");
      if (slotId === "5.4") lines.push("就算最后真的跨出白门，你也不会再只是那个安静记录别人失控的人。你已经让观察、判断和处决在自己身上短暂并轨。");
    }
    return lines;
  }

  function buildPatrickSlotStageLines(slotId, stage, draftState, encounterId) {
    const lines = [];
    const target = getTarget(encounterId);
    const anjieTrust = draftState.relations.anjie || 0;
    const karlSuspicion = draftState.suspicion?.player?.karl || 0;
    if (stage === "opening") {
      if (slotId === "1.1") lines.push("你醒来先分辨回声属于谁。");
      else if (slotId === "1.2") lines.push("你先看见九团不同温度的气息，再认出九个人。");
      else if (slotId === "2.3") lines.push("发电机和密码在你耳里更像一段短祷。");
      else if (slotId === "2.4") lines.push("第二次聚集时，你先听谁在发颤，谁又太稳。");
      else if (slotId === "3.3") lines.push("梅露露死后，这栋楼终于不再装作只是建筑。");
      else if (slotId === "4.4") lines.push("投票室像在逼人替牺牲者命名。");
      else if (slotId === "5.1") lines.push("觉醒时，你先感觉到体内那股饥饿顶了上来。");
      else if (slotId === "5.3" || slotId === "5.4") lines.push("白门亮起来时，你想到的先是安息，不是获救。");
      if (draftState.flags.meruruBlessing && ["3", "4", "5"].includes(slotId[0])) lines.push("梅露露留下的那点微光还没灭。");
      if (anjieTrust >= 14 && ["4", "5"].includes(slotId[0])) lines.push("而安洁那边的线也越来越紧。");
      if (karlSuspicion >= 20) lines.push("卡尔的火气越烧越难收。");
    }
    if (stage === "encounter") {
      if (slotId === "1.2" && target) lines.push(`第一次正式碰面时，你先听${target}给出的是哪一版自己。`);
      if (slotId === "3.3" && target) lines.push(`梅露露倒下后，你再听${target}说话时，会多听一层。`);
      if (slotId === "4.4" && target) lines.push(`投票时和${target}的每句话，之后都会变重。`);
      if (encounterId === "anjie" && anjieTrust >= 14) lines.push("安洁一靠近，你胸口那根线就绷紧。");
      if (encounterId === "meruru" && !draftState.flags.meruruDead) lines.push("面对梅露露时，你总会先放轻声音。");
      if (encounterId === "karl" && karlSuspicion >= 20) lines.push("卡尔声音越高，你越知道他在乱。");
    }
    if (stage === "outcome") {
      if (slotId === "2.4") lines.push("线索一公开，恐惧也会跟着换形。");
      if (slotId === "3.3") lines.push("梅露露的死把很多回声都钉实了。");
      if (slotId === "4.4") lines.push("人群最后需要的未必是真相，只是一个名字。");
      if (slotId === "5.1") lines.push("你越靠近真相，越得拿更多人类的部分去垫。");
      if (slotId === "5.4") lines.push("到了最后，门外也不会替你自动宽恕什么。");
      if (anjieTrust >= 14 && slotId.startsWith("5.")) lines.push("而安洁那边的牵系也更清楚了。");
    }
    if (stage === "ripple") {
      if (slotId === "2.4") lines.push("这次回响会拖很久。");
      if (slotId === "5.1") lines.push("觉醒后，每一步都会反过来追问你。");
      if (slotId === "5.4") lines.push("就算白门打开，回声也还会跟着你。");
    }
    return lines;
  }

  function buildYamadaSlotStageLines(slotId, stage, draftState, encounterId) {
    const lines = [];
    const target = getTarget(encounterId);
    const emilyTrust = draftState.relations.emily || 0;
    const allianceCount = Object.keys(draftState.alliances || {}).length;
    const karlExposed = draftState.flags.karlExposed || 0;
    if (stage === "opening") {
      if (slotId === "1.2") lines.push("第一次进大厅，你先看谁急着出声，谁只顾躲椅背后。");
      else if (slotId.startsWith("2.")) lines.push("线索越扎手，你越得先把语气放平。");
      else if (slotId === "3.3") lines.push("尸体一摆出来，你那些装外行的办法立刻旧了。");
      else if (slotId === "4.4") lines.push("到了投票，连低头都像在给谁递答案。");
      else if (slotId.startsWith("5.")) lines.push("最后一小时，连喘口气都像会被人记上一笔。");
      if ((draftState.flags.emilyProtected || emilyTrust >= 12) && slotId !== "1.1") lines.push("一牵扯艾米莉，你原本算好的分寸就会偏掉。");
      if (allianceCount > 0 && ["3", "4", "5"].includes(slotId[0])) lines.push("一旦有人把你当自己人，你就得替两边收拾话尾。");
      if (karlExposed > 0 && ["4", "5"].includes(slotId[0])) lines.push("卡尔露过一次破绽后，你就知道后面还会再炸。");
    }
    if (stage === "encounter") {
      if (slotId === "1.2" && target) lines.push(`你和${target}都在等对方先露真实反应。`);
      if (slotId === "3.3" && target) lines.push(`死者一出现，你最怕${target}看出你处理这种场面太熟。`);
      if (slotId === "4.4" && target) lines.push(`投票前后，你先得防${target}忽然把矛头转到你身上。`);
      if (encounterId === "emily") lines.push("一面对艾米莉，你就会本能地把话说轻。");
      if (encounterId === "karl") lines.push("和卡尔对上时，你最先防的是他下一秒会不会掀桌。");
    }
    if (stage === "outcome") {
      if (slotId === "3.3") lines.push("尸体一摆出来，你以前见过的脏东西全都跟着回头。");
      if (slotId === "4.4") lines.push("票一公开，刚才所有含糊其辞都得重算。");
      if (slotId === "5.1") lines.push("到了这一步，你更怕自己下一秒会心软，而不是会心狠。");
      else if (slotId === "5.4") lines.push("门口这一刻会把你最后准备偏袒谁写得很明白。");
      else if (slotId.startsWith("5.")) lines.push("越接近结局，你越难只挑对自己有利的话说。");
    }
    if (stage === "ripple") {
      if (slotId.startsWith("4.")) lines.push("投票过后，别人会拿你刚才每次停顿倒着推理由。");
      if (slotId.startsWith("5.")) lines.push("到了白门前，谁都不会再把你当成路过的人。");
    }
    return lines;
  }

  function buildDeboraSlotStageLines(slotId, stage, draftState, encounterId) {
    const lines = [];
    const target = getTarget(encounterId);
    const emilyTrust = draftState.relations.emily || 0;
    const karlExposed = draftState.flags.karlExposed || 0;
    const truth = draftState.stats.truth || 0;
    if (stage === "opening") {
      if (slotId.startsWith("1.")) lines.push("第一小时里，你最熟练的仍是把自己塞回无害的大人壳里。");
      else if (slotId === "2.3") lines.push("一碰到工具和发电机，你那层壳就会立刻绷紧。");
      else if (slotId === "3.3") lines.push("尸体一出现，旧经验会先醒，而你最怕别人也看见这点。");
      else if (slotId.startsWith("4.")) lines.push("投票室的秩序感让你不舒服，它太像另一类现场整理。");
      else if (slotId.startsWith("5.")) lines.push("到了白门前，你很难再躲回玩笑和装糊涂后面。");
      if ((draftState.flags.emilyProtected || emilyTrust >= 12) && slotId !== "1.1") lines.push("艾米莉会让你那层外壳更不稳。");
      if (karlExposed > 0 && ["4", "5"].includes(slotId[0])) lines.push("卡尔一露裂口，你就知道另一种麻烦也逼近了。");
      if (truth >= 4 && slotId.startsWith("5.")) lines.push("线索越完整，你越难说自己只是偶然卷入。");
    }
    if (stage === "encounter") {
      if (slotId === "1.2" && target) lines.push(`第一次碰上${target}时，你先让对方愿意看轻你。`);
      if (slotId === "3.3" && target) lines.push(`在尸体旁再看${target}时，你会先藏住自己太熟练的眼神。`);
      if (slotId.startsWith("4.") && target) lines.push(`投票前后，你和${target}的很多话都像提前写口供。`);
      if (encounterId === "emily") lines.push("面对艾米莉时，你很难把自己真当成顺手安慰两句。");
      if (encounterId === "karl") lines.push("卡尔最恨的，就是有人把他的失控记得太清楚。");
    }
    if (stage === "outcome") {
      if (slotId === "2.3") lines.push("工具和线路最容易让你的专业本能先露头。");
      if (slotId === "3.3") lines.push("尸体一出现，你就知道后患会有多长。");
      if (slotId === "4.1") lines.push("再往前一步，你就得开始盯谁会先把场面带歪。");
      else if (slotId === "4.2") lines.push("越靠近审判，你越难继续把锋芒收进笑里。");
      else if (slotId === "4.3") lines.push("站到白门前，你得承认自己也早被卷进局里了。");
      else if (slotId === "4.4") lines.push("票一落下，你就不再只是旁观的人了。");
      if (slotId === "5.1") lines.push("越靠近白门，你越难分开求生和赎罪。");
      if (slotId === "5.4") lines.push("走到最后，你很难把该丢下的东西也一并算清。");
      if (draftState.flags.emilyProtected || emilyTrust >= 12) lines.push("只要你替艾米莉伸过手，之后就更难抽身。");
    }
    if (stage === "ripple") {
      if (slotId === "4.1") lines.push("这一步之后，你的圆场会更容易被人回想起。");
      else if (slotId === "4.2") lines.push("之后每次有人提起审判，你都会先想自己那句解释。");
      else if (slotId === "4.3") lines.push("白门一近，这段回响就会跟着你往后拖。");
      else if (slotId === "4.4") lines.push("投票之后，你很难再把自己摘得干净。");
      if (slotId === "5.1") lines.push("到了白门前，你会越来越清楚总有东西带不出去。");
      if (slotId === "5.4") lines.push("就算走出去，最后那一眼也不会轻易退掉。");
      if (karlExposed > 0) lines.push("卡尔那边裂开的叙事，也会把你拖进去。");
    }
    return lines;
  }

  function buildFanSlotStageLines(slotId, stage, draftState, encounterId) {
    const lines = [];
    const target = getTarget(encounterId);
    const patrickTrust = draftState.relations.patrick || 0;
    const karlSuspicion = draftState.suspicion?.player?.karl || 0;
    const meruruDead = !!draftState.flags.meruruDead;
    const truth = draftState.stats.truth || 0;
    if (stage === "opening") {
      if (slotId === "1.1") lines.push("牢房像临时告解室。你先怕的不是疼，而是自己先露怯。");
      else if (slotId === "1.2") lines.push("人一多，你就先替每个人找罪与赦免的位置。");
      else if (slotId === "1.3") lines.push("走廊像考问。每扇门都在问你还信不信这套秩序。");
      else if (slotId === "2.1") lines.push("焦味一上来，你先想到净化，也先想到献祭。");
      else if (slotId === "2.4") lines.push("这次回到人群里，你已经不打算只旁听。");
      else if (slotId === "3.3") lines.push("梅露露一死，你连往前走都像得先交代代价。");
      else if (slotId === "4.4") lines.push("落票前，你终于得决定把赦免和怀疑分给谁。");
      else if (slotId === "5.1") lines.push("派翠克觉醒后，你已经来不及把保护活人和送别亡者分成两件事。");
      else if (slotId === "5.2") lines.push("追猎一开始，献身和求生就在你心里打架。");
      else if (slotId === "5.3" || slotId === "5.4") lines.push("白门越近，你越清楚活下来的人也得把彼此欠下的东西一起带出去。");
      if (meruruDead && ["3", "4", "5"].includes(slotId[0])) lines.push("梅露露死后，宽恕在你心里变重了。");
      if (patrickTrust >= 12 && ["4", "5"].includes(slotId[0])) lines.push("你开始怕失去派翠克，不只怕失去证据。");
      if (karlSuspicion >= 20) lines.push("卡尔的火气已经被你归进真正的危险里。");
    }
    if (stage === "encounter") {
      if (slotId === "1.2" && target) lines.push(`你先看${target}此刻的温度够不够撑住后话。`);
      if (slotId === "3.3" && target) lines.push(`梅露露死后，${target}的惊惶会更难藏。`);
      if (slotId === "4.4" && target) lines.push(`投票前再看${target}，你先看的是这眼神会不会改票。`);
      if (encounterId === "patrick" && patrickTrust >= 12) lines.push("你对派翠克会更谨慎，因为她已经不只像线索。");
      if (encounterId === "karl" && karlSuspicion >= 20) lines.push("卡尔一逼近，你先想的是拦，还是挡。");
      if (encounterId === "meruru" && !meruruDead) lines.push("面对梅露露时，你总会先把声音放轻。");
    }
    if (stage === "outcome") {
      if (slotId === "2.4") lines.push("你把线索带回人群时，也把罪责重新推上了桌。");
      if (slotId === "3.3") lines.push("梅露露的死，把大家不肯先说的话逼成了事实。");
      if (slotId === "4.4") lines.push("投票落下后，你知道审判写下的是谁来承担后果。");
      if (slotId === "5.1") lines.push("派翠克的异变，让你第一次怀疑自己是不是把痛苦想得太有意义了。");
      if (slotId === "5.3") lines.push("越靠近白门，你越知道门外也不会替谁把账抹平。");
      if (truth >= 4 && slotId.startsWith("5.")) lines.push("真相一多，你也不能再装作只是被卷入。");
    }
    if (stage === "ripple") {
      if (slotId === "2.4") lines.push("从这次起，你递出去的逻辑会被别人继续借用。");
      if (slotId === "3.4" || slotId.startsWith("4.")) lines.push("投票前后的余波会拖很久。");
      if (slotId === "5.1") lines.push("觉醒之后，你再靠近别人时，先想到的已经不再只是安慰。");
      if (slotId === "5.4") lines.push("就算白门打开，最后那次挡在别人前面的动作也会一直跟着你。");
    }
    return lines;
  }

  function buildZicheSlotStageLines(slotId, stage, draftState, encounterId) {
    const lines = [];
    const target = getTarget(encounterId);
    const patrickTrust = draftState.relations.patrick || 0;
    const emilyTrust = draftState.relations.emily || 0;
    const karlSuspicion = draftState.suspicion?.player?.karl || 0;
    const gateReady = !!draftState.flags.gateReady;
    if (stage === "opening") {
      if (slotId === "1.1") lines.push("你醒来先摸门框和墙角。这里先是笼子，后面才会变成噩梦。");
      else if (slotId === "1.2") lines.push("大厅把人摆开时，你先看站位、视野和谁最像会先动手。");
      else if (slotId === "1.3") lines.push("离开大厅后，路线本身就成了资源。");
      else if (slotId === "2.1") lines.push("深处房间把这栋楼真正能用的部分翻到了台面上。");
      else if (slotId === "2.3") lines.push("发电机和电闸第一次让局面变得可以争夺。");
      else if (slotId === "2.4") lines.push("第二次聚集后，你记的不只线索，还有谁在借答案掩护自己。");
      else if (slotId === "3.3") lines.push("梅露露死后，这里终于从互猜变成了真正的猎场。");
      else if (slotId === "4.4") lines.push("投票前，你想的不是道德，而是门、后路和谁会先崩。");
      else if (slotId === "5.1") lines.push("派翠克觉醒后，大家争的已经不是面子，而是谁来得及活。");
      else if (slotId === "5.2") lines.push("追猎开始后，路线图就变成了生还判断。");
      else if (slotId === "5.3" || slotId === "5.4") lines.push("白门近在眼前时，你知道最麻烦的从来不是门，而是临门一脚前谁先松手。");
      if (gateReady && slotId.startsWith("5.")) lines.push("门一旦可用，争的就不只是能不能开门。");
      if (patrickTrust >= 12 && ["4", "5"].includes(slotId[0])) lines.push("派翠克开始被你归进重点留意的人。");
      if (emilyTrust >= 12 && ["3", "4", "5"].includes(slotId[0])) lines.push("艾米莉的惊慌会逼你更想把局势稳住。");
      if (karlSuspicion >= 20) lines.push("卡尔的火气已经大到不能再当背景噪音。");
    }
    if (stage === "encounter") {
      if (slotId === "1.2" && target) lines.push(`第一次碰面时，你先看${target}值不值得继续观察。`);
      if (slotId === "3.3" && target) lines.push(`梅露露死后再看${target}，你会先看他是不是开始慌。`);
      if (slotId === "4.4" && target) lines.push(`投票前后的每次对视，都像在提前确认战线。`);
      if (encounterId === "patrick" && patrickTrust >= 12) lines.push("和派翠克说话时，你会比平时更留神。");
      if (encounterId === "karl" && karlSuspicion >= 20) lines.push("卡尔一抬高声音，你就先算他会不会失控。");
      if (encounterId === "emily") lines.push("面对艾米莉时，你会本能地先压低语气。");
    }
    if (stage === "outcome") {
      if (slotId === "2.3") lines.push("一碰电闸和密码，你的熟练就更难继续藏。");
      if (slotId === "3.3") lines.push("尸体一出现，后面的每一步都开始按秒计价。");
      if (slotId === "4.4") lines.push("投票最麻烦的，是你已经不能只当旁观者。");
      if (slotId === "5.1") lines.push("派翠克一变，你那套按常规处理人的办法就失效了。");
      if (slotId === "5.3" || slotId === "5.4") lines.push("门前每一步都在逼你立刻做最终取舍。");
      if (gateReady && slotId.startsWith("5.")) lines.push("到了这时候，比机关更麻烦的往往是人。");
    }
    if (stage === "ripple") {
      if (slotId === "2.3") lines.push("发电机一亮，后面争的就不只是开不开门。");
      if (slotId === "3.4" || slotId.startsWith("4.")) lines.push("投票前后的余波会拖很久。");
      if (slotId === "5.2") lines.push("追猎之后，你会更本能地先想哪条路能救命。");
      if (slotId === "5.4") lines.push("白门之后，后果也不会立刻安静。");
    }
    return lines;
  }

  window.SHEPHERD_STAGE_NARRATIVE = {
    buildAnjieSlotStageLines,
    buildPatrickSlotStageLines,
    buildYamadaSlotStageLines,
    buildDeboraSlotStageLines,
    buildFanSlotStageLines,
    buildZicheSlotStageLines,
  };
})();
