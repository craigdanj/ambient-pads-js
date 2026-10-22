/* Shared live/offline chord gate timing. Times are quarter-note beats. */
(function(g){
'use strict';
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function gateLength(chord){return Math.max(.125,chord.length+clamp(Number.isFinite(chord.transition)?chord.transition:-.08,-2,2))}
function endBeat(notes,bars){return Math.max(bars*4,...notes.map(n=>n.start+n.length))}
g.ChordTiming={gateLength,endBeat};
})(globalThis);
