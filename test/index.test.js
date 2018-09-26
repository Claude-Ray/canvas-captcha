const fileType = require('file-type');
const Captcha = require('..');

const captcha = new Captcha(120, 50, 4);

test('native captcha', () => {
  const { text, dataURL } = captcha.createCaptcha();

  expect(text.length).toBe(4);
  expect(fileType(Buffer.from(dataURL, 'base64')))
    .toMatchObject({ ext: 'jpg', mime: 'image/jpeg' });
});

test('custom captcha', () => {
  const { text, buff } = customCaptcha();

  expect(text.length).toBe(4);
  expect(fileType(buff))
    .toMatchObject({ ext: 'png', mime: 'image/png' });
});

/**
 * create custom captcha by combination
 *
 * @return { buff: Buffer, text: string }
 */
function customCaptcha() {
  const { canvas, ctx } = captcha.initCanvas();
  ctx.globalAlpha = 0.8;
  const text = captcha.drawText(ctx);
  captcha.drawLine(ctx);
  captcha.drawPoint(ctx);
  const buff = canvas.toBuffer('image/png');
  return { buff, text };
}
