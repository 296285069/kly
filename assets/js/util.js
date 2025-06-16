// 定义防抖函数
function debounce(func, delay) {
  let timer = null;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
// 获取随机颜色
function getRandomColor(min, max) {
  var r = Math.floor(Math.random() * (max - min) + min);
  var g = Math.floor(Math.random() * (max - min) + min);
  var b = Math.floor(Math.random() * (max - min) + min);
  return "rgb(" + r + "," + g + "," + b + ")";
}

// 生成图形验证码
function generateCaptcha(canvasId) {
  // 生成4位随机字符（数字+字母）
  var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var captcha = "";
  for (var i = 0; i < 4; i++) {
    captcha += chars[Math.floor(Math.random() * chars.length)];
  }

  // 绘制验证码
  var canvas = document.getElementById(canvasId);
  if (!canvas) return captcha;

  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f5f7fa";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制干扰线
  for (var i = 0; i < 5; i++) {
    ctx.strokeStyle = getRandomColor(100, 200);
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }

  // 绘制干扰点
  for (var i = 0; i < 30; i++) {
    ctx.fillStyle = getRandomColor(100, 200);
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      1,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // 绘制验证码文字
  for (var i = 0; i < captcha.length; i++) {
    ctx.save();
    ctx.translate(30 + i * 25, 24);
    ctx.rotate((Math.random() - 0.5) * 0.4);
    ctx.font = "bold " + (28 + Math.random() * 4) + "px Arial";
    ctx.fillStyle = getRandomColor(50, 150);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(captcha[i], 0, 0);
    ctx.restore();
  }

  return captcha;
}

/**
 * 更新URL中的指定参数（无刷新）
 * @param {string} paramName - 参数名
 * @param {string|number|null|undefined} paramValue - 参数值（若为null/undefined则删除该参数）
 */
function updateUrlParam(paramName, paramValue) {
  try {
    // 创建当前URL的副本
    const currentUrl = new URL(window.location.href);

    // 处理参数值：若为null/undefined则删除参数，否则设置参数
    if (paramValue === null || paramValue === undefined) {
      currentUrl.searchParams.delete(paramName); // 删除参数
    } else {
      currentUrl.searchParams.set(paramName, String(paramValue)); // 转换为字符串后设置
    }

    // 更新浏览器历史记录（无刷新）
    history.pushState({}, document.title, currentUrl.href);
  } catch (error) {
    console.error("更新URL参数失败:", error);
  }
}

/**
 * 获取URL中的指定参数值
 * @param {string} paramName - 参数名
 * @param {string} [url=window.location.href] - 可选URL，默认为当前页面URL
 * @returns {string|null} - 参数值（不存在时返回null）
 */
function getUrlParam(paramName, url = window.location.href) {
  try {
    // 创建URL对象（自动处理编码问题）
    const urlObj = new URL(url);

    // 获取参数值（若不存在返回null）
    const paramValue = urlObj.searchParams.get(paramName);

    return paramValue !== null ? paramValue : null;
  } catch (error) {
    console.error("解析URL参数失败:", error);

    // 备用方案：使用正则表达式解析（兼容不支持URL API的浏览器）
    const regex = new RegExp(`[?&]${paramName}=([^&#]*)`);
    const results = regex.exec(url);

    return results ? decodeURIComponent(results[1]) : null;
  }
}

/**
 * 根据邮箱地址打开对应邮箱登录页（支持主流邮箱）
 * @param {string} email - 邮箱地址
 * @param {object} [options] - 可选配置
 * @param {boolean} [options.newTab=true] - 是否在新标签页打开（true/false）
 * @returns {boolean} - 是否成功匹配并打开邮箱（无效邮箱或不支持时返回false）
 */
function openEmailLogin(email, options = { newTab: true }) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("无效的邮箱地址");
    return false;
  }

  const domain = email.split("@")[1].toLowerCase();
  const emailDomains = {
    "qq.com": "https://mail.qq.com",
    "163.com": "https://mail.163.com",
    "126.com": "https://mail.126.com",
    "sina.com": "https://mail.sina.com.cn",
    "sina.cn": "https://mail.sina.com.cn",
    "gmail.com": "https://mail.google.com/mail/u/0/#inbox",
    "outlook.com": "https://outlook.live.com/owa/",
    "hotmail.com": "https://outlook.live.com/owa/",
    "live.com": "https://outlook.live.com/owa/",
    "yeah.net": "https://mail.yeah.net",
    "sohu.com": "https://mail.sohu.com",
    "foxmail.com": "https://mail.qq.com",
    "icloud.com": "https://www.icloud.com/mail/",
  };

  const loginUrl =
    emailDomains[domain] ||
    `https://www.baidu.com/s?wd=${encodeURIComponent(domain) + "邮箱登录"}`;

  try {
    // 移除窗口尺寸参数，仅指定在新标签页打开（现代浏览器默认新标签页）
    window.open(loginUrl, options.newTab ? "_blank" : "_self");
    return true;
  } catch (error) {
    console.error("打开邮箱登录页失败:", error);
    return false;
  }
}

// 密码强度检测
function checkPasswordStrength(password, $strengthElements) {
  // 重置所有强度指示器
  $strengthElements.removeClass("active");

  if (!password) return;

  // 密码长度检查
  var lengthCheck = password.length >= 8;
  // 包含小写字母
  var lowercaseCheck = /[a-z]/.test(password);
  // 包含大写字母
  var uppercaseCheck = /[A-Z]/.test(password);
  // 包含数字
  var numberCheck = /\d/.test(password);
  // 包含特殊字符
  var specialCharCheck = /[^A-Za-z0-9]/.test(password);

  // 计算匹配的条件数量
  var matchCount = [
    lengthCheck,
    lowercaseCheck,
    uppercaseCheck,
    numberCheck,
    specialCharCheck,
  ].filter(Boolean).length;

  // 设置强度级别
  if (matchCount <= 2) {
    // 弱密码
    $strengthElements.eq(0).addClass("active");
  } else if (matchCount <= 3) {
    // 中等密码
    $strengthElements.slice(0, 2).addClass("active");
  } else {
    // 强密码
    $strengthElements.addClass("active");
  }
}

/**
 * 尝试打开用户的邮件客户端以发送邮件
 * @param {string} email - 目标邮箱地址
 * @returns {boolean} 是否成功触发邮件客户端
 */
function openEmailClient(email) {
  // 邮箱格式验证
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  if (!isValidEmail(email)) {
    console.error("Invalid email address:", email);
    return false;
  }

  try {
    // 创建一个 a 标签并模拟点击
    const mailtoLink = document.createElement("a");
    mailtoLink.href = `mailto:${encodeURIComponent(email)}`;
    mailtoLink.style.display = "none"; // 防止影响页面布局
    document.body.appendChild(mailtoLink);
    mailtoLink.click();
    document.body.removeChild(mailtoLink); // 清理 DOM
    return true;
  } catch (error) {
    console.error("Failed to open mail client:", error);
    return false;
  }
}
