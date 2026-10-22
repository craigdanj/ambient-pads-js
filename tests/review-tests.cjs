const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const app=fs.readFileSync('dist/app.js','utf8');
const elements=new Map(),$=id=>{if(!elements.has(id))elements.set(id,{value:'',close(){this.closed=true},getBoundingClientRect(){return {left:0,top:0}},classList:{contains(){return false}}});return elements.get(id)};
let serial=0,stashes=0,message='',edits=0;
const scope={console,$,crypto:require('node:crypto').webcrypto,clamp:(v,a,b)=>Math.min(b,Math.max(a,v)),uid:()=>`new-${++serial}`,stash:()=>stashes++,toast:s=>message=s,edited:()=>edits++,smoothChords:()=>{},editorFocus:()=>{},paintSelection:()=>{},cancelAnimationFrame:()=>{},refresh:()=>{},persist:()=>{}};
vm.createContext(scope);
for(const f of ['harmony','chord-timing','note-editor'])vm.runInContext(fs.readFileSync(`dist/${f}.js`,'utf8'),scope);
vm.runInContext(`var state,selected=new Set(),tool='draw',drag,topMidi=84,insertBeat=0;function chordNotes(c){return PadHarmony.rootVoicing(c)};var editChord=0;`,scope);
vm.runInContext(app.slice(app.indexOf("$('commitChord').onclick="),app.indexOf('function updateChordCompatibility')),scope);
function chord(id,start=0){return {id,root:0,quality:'maj',inversion:0,start,length:4,transition:0}}
function fixture(notes,chords){scope.state={bars:128,notes,chords,autoVoiceLeading:false};scope.editChord=0;for(const [k,v] of Object.entries({chordStart:1,chordBeat:1,chordBars:4,chordTransition:0,root:0,quality:'maj',inversion:0}))$(k).value=String(v);message='';}
const owned=[48,52,55].map((m,i)=>({id:`owned-${i}`,midi:m,start:0,length:4,velocity:.8,chordId:'c'}));
const manual={id:'manual',midi:72,start:0,length:1,velocity:.5};fixture([...owned,manual],[chord('c')]);$('commitChord').onclick();assert(scope.state.notes.some(n=>n.id==='manual'));assert.equal(scope.state.notes.length,4);assert.equal(stashes,1);
fixture([...owned,...Array.from({length:509},(_,i)=>({...manual,id:`manual-${i}`}))],[chord('c')]);$('commitChord').onclick();assert.equal(scope.state.notes.length,512);assert.equal(message,'');
fixture(owned,Array.from({length:64},(_,i)=>chord(i===0?'c':`c${i}`,i*4)));$('commitChord').onclick();assert.equal(scope.state.chords.length,64);assert.equal(message,'');
fixture([...owned,...Array.from({length:509},(_,i)=>({...manual,id:`manual-${i}`}))],[chord('c')]);$('quality').value='maj7';const before=JSON.stringify(scope.state),historyBefore=stashes;$('commitChord').onclick();assert.match(message,/full/);assert.equal(JSON.stringify(scope.state),before);assert.equal(stashes,historyBefore);
// Real pointer handler: clicked cells and Alt placement, with geometry supplied by the test.
scope.point=e=>({beat:e.beat,row:24});scope.snapBeat=(b,alt)=>alt?Math.round(b*100)/100:Math.round(b/Number($('snap').value))*Number($('snap').value);
vm.runInContext(app.slice(app.indexOf("$('grid').onpointerdown="),app.indexOf("$('grid').oncontextmenu=")),scope);$('snap').value='1';$('noteLength').value='1';scope.state={bars:8,notes:[]};
const pointer=(beat,altKey=false)=>({button:0,beat,altKey,shiftKey:false,preventDefault(){},target:{closest(){return null}}});$('grid').onpointerdown(pointer(.8));assert.equal(scope.state.notes[0].start,0);$('grid').onpointerdown(pointer(1.37,true));assert.equal(scope.state.notes[1].start,1.37);
// Playback resync only on committed note changes, including an empty arrangement.
let stops=0,starts=[];scope.stop=()=>{stops++;scope.playing=false};scope.startPlayback=b=>starts.push(b);scope.playing=true;scope.playBeat=7.5;scope.scheduledNotes=JSON.stringify(scope.state.notes);
vm.runInContext(app.slice(app.indexOf('function syncPlaybackEdits()'),app.indexOf('function currentBeat()')),scope);scope.syncPlaybackEdits();assert.equal(stops,0);scope.state.notes[0].midi=61;scope.syncPlaybackEdits();assert.equal(stops,1);assert.deepEqual(starts,[7.5]);scope.playing=true;scope.state.notes=[];scope.syncPlaybackEdits();assert.equal(stops,2);assert.equal(starts.length,1);
// Cancelling a crop restores selection, cursors, history, and enables the next auto-scroll gesture.
const original={bars:8,notes:[manual],loop:false};scope.navGesture={original,selection:['manual'],position:7,insertBeat:9,history:['before'],redo:['redo'],changed:true,wasPlaying:false};scope.navAutoFrame=19;scope.navPointer={clientX:1};scope.selected=new Set();scope.state={bars:1,notes:[]};scope.history=[];scope.redoHistory=[];
vm.runInContext(app.slice(app.indexOf('function finishNavigation('),app.indexOf('function navigationScroll(')),scope);scope.finishNavigation(true);assert.equal(scope.state.bars,8);assert(scope.selected.has('manual'));assert.equal(scope.playBeat,7);assert.equal(scope.insertBeat,9);assert.equal(scope.navAutoFrame,0);assert.equal(scope.navPointer,null);assert.deepEqual(scope.history,['before']);
console.log('PASS: independent-note preservation, edit-at-capacity and atomic rejection, clicked snap cells and Alt drawing, live edit resync/clear, cancelled crop selection/cursors/history and auto-scroll reset.');
