/* Ambient Pad JS note editing operations | MIT */
(function(g){'use strict';
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function chosen(notes,ids){return notes.filter(n=>ids.has(n.id))}
function move(notes,ids,beats,semitones,total){const group=chosen(notes,ids);if(!group.length)return notes;const low=-Math.min(...group.map(n=>n.start)),high=Math.min(total-.001-Math.max(...group.map(n=>n.start)),total+2-Math.max(...group.map(n=>n.start+n.length)));const db=clamp(beats,low,high),dp=clamp(semitones,36-Math.min(...group.map(n=>n.midi)),84-Math.max(...group.map(n=>n.midi)));return notes.map(n=>ids.has(n.id)?{...n,start:+(n.start+db).toFixed(6),midi:n.midi+dp}:n)}
function resize(notes,ids,beats,total){const group=chosen(notes,ids);if(!group.length)return notes;const delta=clamp(beats,Math.max(...group.map(n=>.125-n.length)),Math.min(...group.map(n=>total+2-n.start-n.length)));return notes.map(n=>ids.has(n.id)?{...n,length:+(n.length+delta).toFixed(6)}:n)}
function copy(notes,ids){const group=chosen(notes,ids);if(!group.length)return null;const start=Math.min(...group.map(n=>n.start)),end=Math.max(...group.map(n=>n.start+n.length));return {span:end-start,notes:group.map(({midi,start:s,length,velocity})=>({midi,start:s-start,length,velocity}))}}
function paste(notes,clip,beat,total,uid){if(!clip?.notes?.length)return {error:'Copy some notes first'};if(notes.length+clip.notes.length>512)return {error:'Maximum 512 notes per project'};if(beat<0||clip.notes.some(n=>n.start+beat>=total||n.start+beat+n.length>total+2+.000001))return {error:'Not enough room. Choose an earlier paste position or a longer session.'};const added=clip.notes.map(n=>({...n,id:uid(),start:+(n.start+beat).toFixed(6)}));return {notes:[...notes,...added],ids:new Set(added.map(n=>n.id))}}
function box(notes,rect){return notes.filter(n=>n.start<rect.end&&n.start+n.length>rect.start&&n.midi>=rect.low&&n.midi<=rect.high).map(n=>n.id)}
g.PadNoteEditor={chosen,move,resize,copy,paste,box};
})(globalThis);
