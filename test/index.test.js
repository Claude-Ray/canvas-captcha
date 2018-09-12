const Captcha = require('..');
const captcha = new Captcha(120, 50, 4);

const { text: text1, dataURL: dataURL1 } = captcha.createCaptcha();
console.log(text1, '\n', dataURL1);

// init canvasRenderingContext2D
const { canvas, ctx } = captcha.initCanvas();
// ctx.globalAlpha = 0.8;
const text2 = captcha.drawText(ctx);
captcha.drawLine(ctx);
captcha.drawPoint(ctx);
const dataURL2 = captcha.toDataURL(canvas);
console.log(text2, '\n', dataURL2);
