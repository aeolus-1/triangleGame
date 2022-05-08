var tagFormats = {
  RAINBOW: function (ctx) {
    ctx.fillStyle = [
      "#9400D3",
      "#4B0082",
      "#0000FF",
      "#00FF00",
      "#FFFF00",
      "#FF7F00",
      "#FF0000",
    ][(new Date().getTime() / 250) & 7];
  },
  RED: function (ctx) {
    ctx.fillStyle = "#f00";
  },
  BLUE: function (ctx) {
    ctx.fillStyle = "#00f";

  }
};

var width = 0,
  usernameWidth = 0;

function drawTagText(ctx, text, pos, centered = true) {
  var el = document.createElement("html");
  el.innerHTML = `<html>${text}</html>`;

  var tag = el.children[1];
  //console.log(tags, text)

  ctx.fillStyle = "#000";
  step = 0;
  width = 0;
  usernameWidth = 0;
  if (centered) {
    ctx.save();
    runTagFormatWidth(ctx, tag);
    ctx.restore();

    width = -usernameWidth / 2;
  }

  runTagFormat(ctx, tag, pos);

  return undefined;
}
/*
<rainbow>no<a>a</a></rainbow><b>ya</b>
*/
function runTagFormat(ctx, tag, pos) {
  ctx.save();

  if (tagFormats[tag.tagName] != undefined) {
    tagFormats[tag.tagName](ctx);
  }

  step++;

  for (let i = 0; i < tag.childNodes.length; i++) {
    const node = tag.childNodes[i];
    if (node.tagName == undefined) {
      ctx.fillText(node.textContent, pos.x + width, pos.y);
      width += ctx.measureText(node.textContent).width;
    } else {
      runTagFormat(ctx, node, pos);
    }
  }

  ctx.restore();
}

function runTagFormatWidth(ctx, tag) {
  ctx.save();
  if (tagFormats[tag.tagName] != undefined) {
    tagFormats[tag.tagName](ctx);
  }
  for (let i = 0; i < tag.childNodes.length; i++) {
    const node = tag.childNodes[i];
    if (node.tagName == undefined) {
      usernameWidth += ctx.measureText(node.textContent).width;
    } else {
      runTagFormatWidth(ctx, node);
    }
  }
  ctx.restore();
}
