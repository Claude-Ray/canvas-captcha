'use strict';

const Canvas = require('canvas');
const _ = require('lodash');

class Captcha {
  /**
   * @param {number} width
   * @param {number} height
   * @param {number} length
   * @param {object} [options]
   * @constructor
   */
  constructor(width, height, length, options) {
    this.length = length;
    this.width = width;
    this.height = height;

    const opts = Object.assign({
      fontFamily: 'sans-serif',
      lineWidth: 2,
      chars: '23456789abcdefghjknpqrstuvxyzABCDEFGHJKLNPQRSTUVXYZ',
      colorHex: '23456789',
      bgColor: '#fff'
    }, options);

    opts.fontSize = opts.fontSize || Math.floor(height * 0.8);
    opts.wordSpace = opts.wordSpace || opts.fontSize / 2;
    opts.borderWidth = opts.borderWidth || (width - opts.wordSpace * length) / 2;

    this.opts = opts;
    this.registerFont = Canvas.registerFont;
  }

  /**
   * create captcha easily
   *
   * @return { dataURL: string, text: string }
   * @public
   */
  createCaptcha() {
    const { canvas, ctx } = this.initCanvas();
    const text = this.drawText(ctx);
    this.drawLine(ctx);
    this.drawPoint(ctx);
    const dataURL = this.toDataURL(canvas);
    return { dataURL, text: text.toLowerCase() };
  }

  /**
   * init canvas and context2D
   *
   * @return { canvas: object, ctx: object }
   * @public
   */
  initCanvas() {
    const canvas = Canvas.createCanvas(this.width, this.height);
    const ctx = canvas.getContext('2d');
    return { canvas, ctx };
  }
  /**
   * draw words
   *
   * @param {object} ctx
   * @return {string}
   * @public
   */
  drawText(ctx) {
    const text = this._randomChars();

    ctx.fillStyle = this.opts.bgColor;
    ctx.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.length; i++) {
      ctx.font = `${this.opts.fontSize}px ${this.opts.fontFamily}`;
      ctx.fillStyle = this._randomColor();
      const x = this.opts.borderWidth + (i + Math.random() / 2 - 0.25) * this.opts.wordSpace;
      const y = this.height * 0.8;
      ctx.fillText(text[i], x, y);
    }

    return text;
  }

  /**
   * draw lines
   *
   * @param {object} ctx
   * @public
   */
  drawLine(ctx) {
    ctx.lineWidth = this.opts.lineWidth;

    for (let i = 0; i < this.length; i++) {
      ctx.strokeStyle = this._randomColor();
      ctx.beginPath();
      ctx.moveTo(0, _.random(0, this.height));
      ctx.lineTo(this.width, _.random(0, this.height));
      ctx.stroke();
    }
  }

  /**
   * draw points
   *
   * @param {object} ctx
   * @param {object} [opts]
   * @param {number} [opts.density]
   * @param {number} [opts.radius]
   * @public
   */
  drawPoint(ctx, { density = 0.05, radius = 1 } = {}) {
    const pixelCount = this.width * this.height * density;

    for (let i = 0; i < pixelCount; i++) {
      ctx.fillStyle = this._randomColor();
      ctx.beginPath();
      ctx.arc(_.random(0, this.width), _.random(0, this.height), radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  /**
   * return a data URI
   *
   * @param {object} canvas
   * @return {string}
   * @public
   */
  toDataURL(canvas) {
    const captchaBuff = canvas.toBuffer('image/jpeg', { quality: 0.5 });
    return Buffer.from(captchaBuff).toString('base64');
  }

  /**
   * get random characters
   *
   * @return {string}
   * @private
   */
  _randomChars() {
    return _.sampleSize(this.opts.chars, this.length).join('');
  }

  /**
   * get random color
   *
   * @return {string}
   * @private
   */
  _randomColor() {
    return '#' + _.sampleSize(this.opts.colorHex, 3).join('');
  }
}

module.exports = Captcha;
