/* Ambient Pad JS timeline and transport helpers | MIT */
(function(g){'use strict';
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function loopRange(start,end,total){start=clamp(Number.isFinite(start)?start:0,0,total-.25);end=clamp(Number.isFinite(end)?end:total,start+.25,total);return {start,end}}
function normalizeView(v={}){v=v&&typeof v==='object'?v:{};return {beatWidth:Number.isFinite(v.beatWidth)&&v.beatWidth>0?clamp(v.beatWidth,.5,160):0,rowH:Number.isFinite(v.rowH)?clamp(v.rowH,6,36):18,follow:v.follow===true,scrollLeft:Number.isFinite(v.scrollLeft)?Math.max(0,v.scrollLeft):0,scrollTop:Number.isFinite(v.scrollTop)?Math.max(0,v.scrollTop):340}}
function formatBeat(beat){const b=Math.round(beat*100)/100;return Math.floor(b/4)+1+':'+Number((b%4+1).toFixed(2))}
function parseBeat(text){const m=String(text).trim().match(/^(\d+)\s*:\s*(\d+(?:\.\d+)?)$/);if(!m||+m[1]<1||+m[2]<1||+m[2]>=5)return null;return (+m[1]-1)*4+(+m[2]-1)}
function anchorScroll(scroll,anchor,offset,oldSize,newSize){return Math.max(0,offset+(scroll+anchor-offset)/oldSize*newSize-anchor)}
function position(elapsed,start,from,to,loop){elapsed=Math.max(0,elapsed);const first=to-start;if(elapsed<first)return start+elapsed;return loop?from+(elapsed-first)%(to-from):to}
function segment(notes,from,to,clipEnd){const result=[];for(const n of notes){const end=n.start+n.length,start=Math.max(n.start,from),overflow=to===clipEnd?Math.min(2,Math.max(0,end-clipEnd)):0,gateEnd=Math.min(end,to+overflow);if(n.start<to&&end>from&&gateEnd>start)result.push({...n,type:'note',beat:start-from,length:gateEnd-start})}for(let b=Math.ceil(from);b<to;b++)result.push({type:'click',beat:b-from,accent:b%4===0});return result.sort((a,b)=>a.beat-b.beat)}
g.PadNavigation={loopRange,normalizeView,formatBeat,parseBeat,anchorScroll,position,segment};
})(globalThis);
