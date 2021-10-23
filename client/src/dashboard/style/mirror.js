import { css } from '@emotion/css'



const style = css`
 *,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
*:focus,
*::before:focus,
*::after:focus {
  outline: none;
}
*::-webkit-input-placeholder,
*::before::-webkit-input-placeholder,
*::after::-webkit-input-placeholder {
  color: #222;
}
*::-moz-placeholder,
*::before::-moz-placeholder,
*::after::-moz-placeholder {
  color: #222;
}


button {
  border: 0;
}
button:focus {
  border: none;
  outline: 0 !important;
  outline-style: none;
}

.container {
  width: 550px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.container .btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 100ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0px -6px 10px white, 0px 4px 15px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
.container .btn:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  z-index: 2;
}
.container .btn:active {
  box-shadow: 0 15px 20px rgba(0, 0, 0, 0.02);
}
.container .btn:active:after {
  box-shadow: inset 0px -2px 5px white, inset 0px 2px 5px rgba(0, 0, 0, 0.15);
}
.container .btn.active.play-pause .icon.pause {
  opacity: 1;
  transform: translate(-50%, -50%);
}
.container .btn.active.play-pause .icon.play {
  opacity: 0;
  transform: translate(-50%, 50%);
}
.container .btn .icon-container,
.container .btn a {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.container .btn a {
  z-index: 10;
}
.container .btn .icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inline-block;
  fill: #868686;
  height: 1.4rem;
  vertical-align: middle;
  width: 1.4rem;
  transition: all 100ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.container .btn.play-pause .icon.pause {
  opacity: 0;
  transform: translate(-50%, 50%);
}
.container .btn.volume-control {
  height: 160px;
  border-radius: 50px;
}
.container .btn.volume-control::after {
  border-radius: 50px;
}
.container .btn.volume-control .icon-container {
  height: 50%;
}
.container .btn.volume-control .icon-container:last-child {
  transform: translateY(100%);
}
.container .btn.volume-control .icon {
  width: 1.6rem;
  height: 1.6rem;
}
.container .btn.volume-control .icon.plus {
  transform: translate(-50%, -50%);
}
.container .btn.volume-control .icon.minus {
  transform: translate(-50%, -50%);
}
`;

export default style
