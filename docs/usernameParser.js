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
  GREEN:function(ctx) {
    ctx.fillStyle = [

        "#00FF00",
        "#12c915",
        "#208021",
        "#55ed58",
        "#255426",
        "#8bad8b",
        "#013802",

      ][(new Date().getTime() / 250) & 7];
  },
  FLASHING:function(ctx) {
    ctx.fillStyle = [

      "#ff0",
      "#000"
      

    ][(new Date().getTime() / 100) & 2];
  },
  GREY:function(ctx) {
      ctx.fillStyle = "#696969"
  },
  BOLD:function(ctx) {
    ctx.font = "bold 20px Times New Roman";
  },
  ITALIC:function(ctx) {
    ctx.font = "italic 20px Times New Roman";
  }
};

var width = 0,
  usernameWidth = 0;

  function measureTextTags(ctx, text) {
    var el = document.createElement("html");
    el.innerHTML = `<html>${text}</html>`;

    usernameWidth = 0
  
    var tag = el.children[1];
    ctx.save();
    runTagFormatWidth(ctx, tag);
    ctx.restore();

    return usernameWidth
  
  }

function drawTagText(ctx, text, pos) {
  var el = document.createElement("html");
  el.innerHTML = `<html>${text}</html>`;

  var tag = el.children[1];
  //console.log(tags, text)

  ctx.fillStyle = "#000";
  ctx.font = "20px Times New Roman"
  step = 0;
  width = 0;

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
