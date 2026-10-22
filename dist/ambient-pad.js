/* Ambient Pad JS 1.4.0 | MIT | Craig Johnson */
(function (g) {
'use strict';
const waves=['sine','triangle','sawtooth','square'];
const defaults={wave:'sawtooth',attack:1.8,release:3.5,cutoff:1600,resonance:.6,detune:12,motion:.18,depth:650,reverb:.42,delay:.2,volume:.65,
 layerWave:'triangle',layerMix:0,layerOctave:0,layerDetune:7,filterEnv:0,filterAttack:2,filterDecay:3,filterSustain:.4,chorus:0,chorusRate:.22,chorusDepth:.004,pitchDepth:0,pitchRate:.15,panDepth:0,panRate:.09};
const ranges={attack:[.01,6],release:[.05,10],cutoff:[100,12000],resonance:[.1,8],detune:[0,40],motion:[.01,3],depth:[0,2000],reverb:[0,1],delay:[0,1],volume:[0,1],layerMix:[0,1],layerOctave:[-1,1],layerDetune:[-40,40],filterEnv:[-4000,6000],filterAttack:[.01,8],filterDecay:[.01,10],filterSustain:[0,1],chorus:[0,1],chorusRate:[.05,2],chorusDepth:[0,.01],pitchDepth:[0,30],pitchRate:[.02,3],panDepth:[0,1],panRate:[.02,2]};
class AmbientPad {
 constructor(context,options={}) {
  this.context=context;this.params={...defaults};this.voices=new Set();this.disposed=false;
  const c=context;this.input=c.createGain();this.input.gain.value=.22;
  this.bus=c.createGain();this.chorusDry=c.createGain();this.chorusWet=c.createGain();
  this.input.connect(this.chorusDry).connect(this.bus);this.chorusWet.connect(this.bus);
  this.chorusLfo=c.createOscillator();this.chorusNodes=[];
  for(let i=0;i<2;i++) {const delay=c.createDelay(.1),mod=c.createGain(),pan=c.createStereoPanner();delay.delayTime.value=.022+i*.005;pan.pan.value=i?1:-1;this.input.connect(delay).connect(pan).connect(this.chorusWet);this.chorusLfo.connect(mod).connect(delay.delayTime);this.chorusNodes.push({delay,mod,pan});}
  this.dry=c.createGain();this.wet=c.createGain();this.send=c.createGain();this.delay=c.createDelay(2);this.delay.delayTime.value=.375;this.feedback=c.createGain();this.feedback.gain.value=.3;this.convolver=c.createConvolver();
  const b=c.createBuffer(2,c.sampleRate*5,c.sampleRate);let seed=1234;
  for(let ch=0;ch<2;ch++){let a=b.getChannelData(ch);for(let i=0;i<a.length;i++){seed=(seed*16807)%2147483647;a[i]=(seed/2147483647*2-1)*Math.pow(1-i/a.length,3)}}this.convolver.buffer=b;
  this.output=c.createGain();this.limiter=c.createDynamicsCompressor();this.limiter.threshold.value=-8;this.limiter.ratio.value=12;
  this.bus.connect(this.dry).connect(this.output);this.bus.connect(this.convolver).connect(this.wet).connect(this.output);this.bus.connect(this.send).connect(this.delay);this.delay.connect(this.feedback).connect(this.delay);this.delay.connect(this.output);this.output.connect(this.limiter).connect(c.destination);
  this.set(options);this.ready=true;this.chorusLfo.start();
 }
 set(changes) {
  if(this.disposed)throw Error('Synth has been disposed');
  for(const k in changes){if((k==='wave'||k==='layerWave')&&waves.includes(changes[k]))this.params[k]=changes[k];else if(ranges[k]&&Number.isFinite(changes[k])){this.params[k]=Math.min(ranges[k][1],Math.max(ranges[k][0],changes[k]));if(k==='layerOctave')this.params[k]=Math.round(this.params[k])}}
  const p=this.params,t=this.context.currentTime,smooth=(param,value)=>this.ready?param.setTargetAtTime(value,t,.08):param.setValueAtTime(value,t);
  smooth(this.output.gain,p.volume);smooth(this.dry.gain,1-p.reverb*.4);smooth(this.wet.gain,p.reverb);smooth(this.send.gain,p.delay*.55);smooth(this.chorusDry.gain,1-p.chorus*.35);smooth(this.chorusWet.gain,p.chorus*.35);smooth(this.chorusLfo.frequency,p.chorusRate);
  this.chorusNodes.forEach((n,i)=>smooth(n.mod.gain,p.chorusDepth*(i?1:-1)));
  for(const v of this.voices){smooth(v.filter.frequency,p.cutoff);smooth(v.filter.Q,p.resonance);smooth(v.lfo.frequency,p.motion);smooth(v.mod.gain,p.depth);smooth(v.pitchLfo.frequency,p.pitchRate);smooth(v.pitchMod.gain,p.pitchDepth);smooth(v.panLfo.frequency,p.panRate);smooth(v.panMod.gain,p.panDepth);smooth(v.layerGain.gain,p.layerMix);smooth(v.mainGain.gain,1-p.layerMix*.3);
   v.oscs.forEach((o,i)=>{const secondary=i>=3,index=i%3;o.type=secondary?p.layerWave:p.wave;smooth(o.detune,(index-1)*p.detune+(secondary?p.layerDetune:0));smooth(o.frequency,440*Math.pow(2,(v.midi-69+(secondary?p.layerOctave*12:0))/12))});
  }return this;
 }
 note(midi,when=this.context.currentTime,duration=2,velocity=.8) {
  if(this.disposed)throw Error('Synth has been disposed');if(!Number.isFinite(midi)||midi<0||midi>127)throw Error('MIDI note must be 0–127');if(!Number.isFinite(duration)||duration<=0)throw Error('Duration must be positive');if(!Number.isFinite(when)||!Number.isFinite(velocity))throw Error('Time and velocity must be finite');if(!this.context.startRendering&&this.voices.size>=96)return null;
  const c=this.context,p={...this.params},t=Math.max(c.currentTime,when),end=t+duration,finish=end+p.release+.05;
  const filter=c.createBiquadFilter(),env=c.createGain(),pan=c.createStereoPanner(),mainGain=c.createGain(),layerGain=c.createGain();mainGain.gain.value=1-p.layerMix*.3;layerGain.gain.value=p.layerMix;mainGain.connect(filter);layerGain.connect(filter);filter.type='lowpass';filter.frequency.value=p.cutoff;filter.Q.value=p.resonance;filter.connect(env).connect(pan).connect(this.input);
  velocity=Math.max(.01,Math.min(1,velocity));env.gain.value=0;env.gain.setValueAtTime(0,t);env.gain.linearRampToValueAtTime(velocity*.26,t+Math.min(p.attack,duration*.8));env.gain.setValueAtTime(velocity*.26,end);env.gain.linearRampToValueAtTime(0,end+p.release);
  const oscs=[],pans=[];for(let i=0;i<6;i++){const secondary=i>=3,index=i%3,o=c.createOscillator(),op=c.createStereoPanner();o.type=secondary?p.layerWave:p.wave;o.frequency.value=440*Math.pow(2,(midi-69+(secondary?p.layerOctave*12:0))/12);o.detune.value=(index-1)*p.detune+(secondary?p.layerDetune:0);op.pan.value=(index-1)*.65;o.connect(op).connect(secondary?layerGain:mainGain);o.start(t);o.stop(finish);oscs.push(o);pans.push(op)}
  const lfo=c.createOscillator(),mod=c.createGain(),pitchLfo=c.createOscillator(),pitchMod=c.createGain(),panLfo=c.createOscillator(),panMod=c.createGain(),filterSource=c.createConstantSource(),filterCurve=c.createGain();
  lfo.frequency.value=p.motion;mod.gain.value=p.depth;lfo.connect(mod).connect(filter.frequency);pitchLfo.frequency.value=p.pitchRate;pitchMod.gain.value=p.pitchDepth;pitchLfo.connect(pitchMod);oscs.forEach(o=>pitchMod.connect(o.detune));panLfo.frequency.value=p.panRate;panMod.gain.value=p.panDepth;panLfo.connect(panMod).connect(pan.pan);
  const fa=Math.min(p.filterAttack,duration*.65),fd=Math.min(p.filterDecay,Math.max(.001,duration-fa));filterCurve.gain.value=0;filterCurve.gain.setValueAtTime(0,t);filterCurve.gain.linearRampToValueAtTime(p.filterEnv,t+fa);filterCurve.gain.linearRampToValueAtTime(p.filterEnv*p.filterSustain,Math.min(end,t+fa+fd));filterCurve.gain.setValueAtTime(p.filterEnv*p.filterSustain,end);filterCurve.gain.linearRampToValueAtTime(0,end+p.release);filterSource.connect(filterCurve).connect(filter.frequency);
  const sources=[...oscs,lfo,pitchLfo,panLfo,filterSource];[lfo,pitchLfo,panLfo,filterSource].forEach(o=>{o.start(t);o.stop(finish)});
  const nodes=[filter,env,pan,mainGain,layerGain,...oscs,...pans,lfo,mod,pitchLfo,pitchMod,panLfo,panMod,filterSource,filterCurve];
  const v={midi,oscs,sources,filter,env,mainGain,layerGain,lfo,mod,pitchLfo,pitchMod,panLfo,panMod};this.voices.add(v);oscs[0].onended=()=>{this.voices.delete(v);nodes.forEach(n=>n.disconnect())};return v;
 }
 stop(){const t=this.context.currentTime;for(const v of this.voices){if(v.env.gain.cancelAndHoldAtTime)v.env.gain.cancelAndHoldAtTime(t);else v.env.gain.cancelScheduledValues(t);v.env.gain.setTargetAtTime(0,t,.015);v.sources.forEach(o=>{try{o.stop(t+.1)}catch{}})}}
 dispose(){if(this.disposed)return;this.stop();this.disposed=true;this.chorusLfo.stop();this.chorusLfo.disconnect();this.chorusNodes.forEach(n=>Object.values(n).forEach(node=>node.disconnect()));for(const k of ['input','bus','chorusDry','chorusWet','dry','wet','send','delay','feedback','convolver','output','limiter'])this[k].disconnect()}
 static get defaults(){return {...defaults}}
}
g.AmbientPad=AmbientPad;
})(globalThis);
