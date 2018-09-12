'use strict';

const Canvas = require('canvas');
const lodash = require('lodash');

class Captcha {
  /**
   * @param {number} width
   * @param {number} height
   * @param {number} length
   * @constructor
   */
  constructor(width, height, length) {
    this.length = length;
    this.width = width;
    this.height = height;

    this.fontSize = Math.floor(height * 0.8);
    this.fontFamily = 'sans-serif';
    this.wordSpace = this.fontSize * 0.5;
    this.borderWidth = (width - this.wordSpace * length) / 2;
    this.chars = '23456789abcdefghjknpqrstuvxyzABCDEFGHJKLNPQRSTUVXYZ';
    this.colorHex = '23456789';
  }

  /**
   * create captcha easily
   *
   * @return { dataURL: string, text: string }
   * @public
   */
  createCaptcha() {
    const { canvas, ctx } = this.initCanvas();
    // ctx.globalAlpha = 0.8;
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

    ctx.fillStyle = this.bgc || '#fff';
    ctx.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.length; i++) {
      ctx.font = `${this.fontSize}px ${this.fontFamily}`;
      ctx.fillStyle = this._randomColor();
      ctx.fillText(text[i], this.borderWidth + (i + Math.random() / 2 - 0.25) * this.wordSpace, this.height * 0.8);
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
    ctx.lineWidth = 2;

    for (let i = 0; i < this.length; i++) {
      ctx.strokeStyle = this._randomColor();
      ctx.beginPath();
      ctx.moveTo(0, this._randomNum(0, this.height));
      ctx.lineTo(this.width, this._randomNum(0, this.height));
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
      ctx.arc(this._randomNum(0, this.width), this._randomNum(0, this.height), radius, 0, 2 * Math.PI);
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
    return lodash.sampleSize(this.chars, this.length).join('');
  }

  /**
   * get random color
   *
   * @return {string}
   * @private
   */
  _randomColor() {
    return '#' + lodash.sampleSize(this.colorHex, 3).join('');
  }

  /**
   * get random number between `lower` and `upper`
   *
   * @return {string}
   * @private
   */
  _randomNum(lower, upper) {
    return lodash.random(lower, upper);
  }
}

module.exports = Captcha;
