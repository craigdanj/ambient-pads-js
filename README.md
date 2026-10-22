# Ambient Pad JS — Drift

A dependency-free Web Audio ambient pad synthesizer and piano roll studio for creating backing tracks. Version **1.4.0**. MIT license.

## Run the studio

Open `dist/index.html` in a current Chrome, Edge, Firefox or Safari browser, or serve `dist/` with any static web server. Press Play to enable audio. Everything runs locally: no samples, accounts, microphone access or external dependencies are required.

1. Choose one of eight presets. The original six have been retuned with expressive synthesis; **Slow bloom** and **Orbit choir** demonstrate the new filter envelope, layering and motion.
2. Open the sound sections to adjust amplitude, a second oscillator layer, filter, filter envelope, slow motion, chorus/effects, and output. Preview chord auditions the current sound.
3. Choose a **Key** and **Scale**. Major, natural minor, Dorian, Mixolydian, Lydian and harmonic minor are supported. The seven scale degrees offer a triad and seventh; click one to open the chord editor. Load a progression, or use **+ Chord**. Choose its root, quality, inversion, start bar, start beat, duration in beats and transition. Placement and duration support quarter-beat increments. Major, minor, major seventh, minor seventh, minor ninth, sus2, dominant seventh, diminished, half-diminished seventh, diminished seventh, augmented, minor-major seventh and augmented-major seventh are supported.
4. Set individual chord transitions, or use the **Chord transitions** strip and **Apply to all chords**. Negative values release the outgoing notes before the chord boundary, zero joins the note gates, and positive values extend the outgoing notes beyond their chord boundary. The range is −2 to +2 quarter-note beats. Presets: Breathing gap (−0.5), Connected (0), Soft overlap (+1), Ambient wash (+2). The minimum note gate is 0.125 beats. Amplitude release and effect tails continue after note-off, even with a gap; use a shorter Release for clearer separation.
5. Use **Select (V)** and drag a box, or Shift-click notes to add/remove them from the selection. Drag any selected note to move the group; drag its right edge to resize all selected notes by the same duration. Time/pitch limits constrain the group together, preserving relative placement. Alt-drag bypasses snap. **Draw (B)** adds notes; **Erase (E)** or right-click removes one note. Double-click deletes one note. Set velocity for all selected notes with the slider. Copy, Cut, Paste and Duplicate are available in the edit toolbar. Set **Paste at beat** (1-based quarter-note beat across the clip), or Shift-click the ruler to position the paste cursor. A normal ruler click seeks playback. Duplicate places the group immediately after its selected span, rounded up to the snap grid. The clipboard stays within this studio tab and is cleared on reload. Paste/duplicate reject the whole operation if it exceeds the clip plus two-beat tail or the 512-note cap. Undo/redo cover 100 arrangement edits and restore note selection; sound controls stay as currently set. A whole drag or velocity-slider gesture is one undo step.
6. Choose a clip length from 1 to 128 bars in 4/4 at 35–180 BPM. Enable looping and optional metronome for practice. Space pauses/resumes when focus is outside a control; Stop returns to the active loop start, or the clip start when looping is off. Final-chord overlaps extend over the loop seam and are shown in a shaded **LOOP TAIL** region. The first pass starts clean; subsequent passes include the outgoing pad tail.
7. Save/open portable JSON projects. The latest session also autosaves to browser local storage. **Export WAV** renders one pass, including any final chord overlap plus release/reverb tail, as stereo 44.1 kHz 16-bit PCM. Metronome clicks are excluded. Peaks are reduced only if needed to avoid clipping; quiet tracks are not normalized upward.

Note edits made while playing are heard on the next loop; stop and play to hear them immediately. Changing tempo restarts playback from the active range start. Waveforms, layer blend/register, detuning, cutoff/resonance, pitch/pan/filter LFO settings and effects update held notes. Amplitude and filter envelope settings apply to new notes. Playback pauses when the tab is hidden to avoid timer-throttling glitches; keep the studio visible while jamming.

Chord cards are editing helpers, not automatic chord analysis. Manual pitch/timing edits detach only the chord cards owning affected notes, leaving other cards intact. Detached notes stay on the roll and are no longer changed by chord voice leading or transition controls. Adding or editing a chord replaces notes in its occupied timeline region. Loading a progression replaces the arrangement; Undo restores it. Reducing the session length crops the arrangement. Up to 512 notes and 64 chord cards are supported, over C2–C6. Dense pads and long overlaps use more CPU. The live engine supports up to 96 concurrent voices, six oscillators each; offline export includes every scheduled note.

## Piano roll keyboard shortcuts

Keyboard shortcuts apply outside text/select/range fields and dialogs. Click the roll or a note to focus editing.

| Action | Shortcut |
|---|---|
| Select / Draw / Erase | V / B / E |
| Add/remove a note from selection | Shift-click |
| Add a selection box | Shift-drag on empty grid |
| Select all notes | Ctrl/Cmd+A |
| Copy / Cut / Paste | Ctrl/Cmd+C / X / V |
| Duplicate selection | Ctrl/Cmd+D |
| Move by snap step / semitone | Left/Right / Up/Down |
| Move by bar / octave | Shift+Left/Right / Shift+Up/Down |
| Delete selection | Delete or Backspace |
| Undo | Ctrl/Cmd+Z |
| Redo | Ctrl/Cmd+Shift+Z or Ctrl+Y |
| Clear selection / cancel current drag | Escape |
| Bypass snap while dragging | Alt |
| Play/pause | Space (outside buttons/fields) |
| Horizontal zoom | + / −, or Ctrl/Cmd-wheel over the roll |
| Vertical zoom | Alt-wheel over the roll |
| Fit clip / selection | F / Shift+F |
| Seek start / near end of active range | Home / End |
| Horizontal scroll | Shift-wheel |

Multi-note resize adds the same duration to every selected note; it does not proportionally time-stretch the phrase. New/copy/paste notes preserve their own velocities, while the selection velocity slider sets a single value on the selected group. The clipboard and selection are editing state, not stored in project JSON. Actual edited notes are saved and exported normally. Undo history is per-tab and resets on reload. Clip lengths now support every whole-bar value from 1 to 128.

## Navigation and clip length

- **Resize the clip:** enter 1–128 bars in the transport Length field and press the adjacent arrow, or drag the **END** handle on the ruler. Dragging snaps to whole bars. Extending creates empty timeline space; it does not stretch or repeat notes. Shortening removes notes starting after the new end, crops remaining note gates to the new end plus a two-beat tail, and trims chord helpers. Undo restores cropped material. The full loop end follows an extended clip; a custom loop stays where it was, clamped if the clip shrinks. The next two bars are shown dimly beyond the clip end, providing room to drag the end handle. Loop and clip handles scroll horizontally near viewport edges while dragging.
- **Zoom:** use H/V zoom controls or the +/− horizontal buttons. Ctrl/Cmd-wheel zooms horizontally and Alt-wheel zooms vertically around the pointer. Toolbar zoom keeps the viewport center as its anchor. H scale is 0.5–160 px/beat; V scale is 6–36 px/semitone. **1:1** restores 27 px/beat and 18 px/semitone. Very small notes hide their text; zoom in to edit precisely.
- **Fit and scroll:** Fit clip (F) shows the clip's time span. Fit selection (Shift+F) frames selected notes in both dimensions. Shift-wheel scrolls horizontally; normal wheel scrolls vertically. Piano keys and the ruler remain visible while scrolling. Zoom, scroll position and Follow setting are saved in project files/autosave and are separate from arrangement undo history.
- **Seek:** click the ruler to place the playhead, stopped or playing. The transport shows bar:beat. With Loop enabled, seeking is constrained to the active loop. Disable Loop to seek anywhere in the clip. Seeking into a held chord retriggers the notes that are still active at that time, with the current pad envelope; notes that already ended are excluded. Shift-click the ruler sets the independent paste cursor without moving playback.
- **Loop:** drag either loop handle, drag the loop strip to move the entire range, or type bar:beat positions and click Set range. For example **3:1 → 5:1** repeats bars 3 and 4; the end is exclusive. The range can be as short as a quarter beat. Loop selection encloses selected notes and enables looping. Full clip resets the loop range. Handle keyboard arrows move by the current snap step; the END handle arrows resize by one bar. Escape cancels a handle drag. Loop/length changes are undoable.
- **Follow playhead:** enable it to scroll horizontally as playback leaves the visible area. Turn it off to explore the timeline independently. Pause preserves the current position; Stop returns to the active range start. Home/End seek to the active range start/near end. Playback remains paused when returning to a hidden tab until you press Play again.

Playback honors the chosen loop range. Subrange loops retrigger held notes at the loop start and release them at the loop end, allowing normal pad release/reverb tails to spill over. Explicit gate overlaps beyond the full clip end are retained when looping the full clip. **WAV export always renders the entire clip**, including gate/effect tails, regardless of the current loop or playhead position. Longer clips and high-polyphony arrangements take more time and memory to render. The synth's 96-live-voice and 512-note arrangement limits still apply.

## Key, scale and voice leading

Selecting a key/scale updates the chord suggestions and piano roll shading immediately. Scale tones and the tonic are highlighted, with appropriate sharp/flat spellings. Chords outside the scale remain available and are marked; choosing a scale never silently changes existing pitches. The progression templates follow the selected key and scale when you press Load. **Transpose to key** shifts the existing arrangement by the shortest semitone interval from its tonic reference; it preserves chord qualities, so changing mode may leave borrowed chords. It moves all notes, including manually drawn notes, and rejects moves outside C2–C6. The semitone transpose controls also update the tonic reference and keep chord cards.

**Auto voice leading** recomputes voicings when enabled, when a progression loads, when chords are added/edited, or when looping changes. It anchors the first chord's current voicing, then chooses a minimum-motion path through compact voicings of later chords. With Loop enabled, the final-to-first transition contributes to the cost. The engine preserves chord pitch classes and voice counts; it uses octave placement/inversions, without changing chord quality. Candidate voicings for later chords lie in C3–E5 with a maximum 19-semitone spread. This is a smooth-pad heuristic, rather than a complete classical counterpoint rule system.

**Smooth now** applies voice leading once, whether or not the Auto checkbox is enabled. **Reset voicings** disables Auto and returns each chord to its selected inversion. Turn Auto off before choosing manual inversions in the chord editor. Smoothing updates the actual piano-roll pitches; note timing, velocity, sound and transition settings stay intact. Changes made while playing are heard on the next loop, or immediately after stop/play. Old projects load with Auto disabled to preserve their existing notes. New sessions enable it by default. Key, scale, auto mode and selected voicings are saved in project JSON and autosave; voiced notes are used directly in WAV export.

## Expressive synthesis

- **Second layer:** a second bank of three oscillators with its own waveform, blend, octave (−1/0/+1) and detune offset. Primary level is reduced slightly as the layer is added, limiting level jumps.
- **Filter envelope:** a per-note opening or closing sweep, with signed amount, attack, decay and sustain. It adds to the base cutoff and filter LFO. The sweep returns toward the base during note release.
- **Slow motion:** independent sine LFOs modulate oscillator pitch in cents and the stereo position of each voice, alongside the existing filter LFO.
- **Stereo chorus:** two short delay lines with opposite delay modulation, separate left/right placement, and adjustable mix, speed and depth. This produces gentle stereo movement and thickness.
- **Space:** stereo convolution reverb, fixed 375 ms feedback delay and an output compressor.

Original version 1 projects remain readable. Missing expressive settings are filled with neutral values so old sounds are preserved; reselect a preset to hear its upgraded version. Files retain project format version 1 with optional new fields.

## Use the synth plugin

Copy `dist/ambient-pad.js`; it exposes `AmbientPad` globally with no UI dependency.

```html
<script src="ambient-pad.js"></script>
<button id="start">Play pad</button>
<script>
let ctx, pad;
document.getElementById('start').onclick = async () => {
  ctx ||= new AudioContext();
  pad ||= new AmbientPad(ctx, {
    attack: 2, release: 4, reverb: .5,
    layerWave: 'triangle', layerMix: .3, layerOctave: 1,
    filterEnv: 1800, filterAttack: 3, filterDecay: 4,
    chorus: .4, pitchDepth: 4, panDepth: .25
  });
  await ctx.resume();
  const start = ctx.currentTime + .03;
  [48, 52, 55, 59].forEach(midi => pad.note(midi, start, 4, .8));
};
</script>
```

### API

- `new AmbientPad(audioContext, options)` — connects the compressor output to the context destination; supports AudioContext and OfflineAudioContext.
- `pad.note(midi, when, duration, velocity)` — schedules a note. Time/duration are seconds on the context clock. Velocity is clamped to 0.01–1. Returns a voice handle or null if the live voice cap is reached. MIDI, time, duration and velocity must be finite; duration must be positive and MIDI must be 0–127.
- `pad.set({cutoff: 2400, chorus: .6})` — smoothly updates held voices/effects. Returns the instance. Envelope controls take effect on new notes.
- `pad.stop()` — fades active/scheduled voices; existing effects decay naturally.
- `pad.dispose()` — stops/disconnects all owned sources/effects. Idempotent. Close your AudioContext when finished.
- `AmbientPad.defaults` — a copy of the default settings. New expressive effects default to neutral; the demo presets enable them.

| Parameter | Default | Range / values |
|---|---:|---|
| wave | sawtooth | sine, triangle, sawtooth, square |
| attack | 1.8 | 0.01–6 seconds |
| release | 3.5 | 0.05–10 seconds (demo minimum 0.1) |
| cutoff | 1600 | 100–12000 Hz (demo maximum 8000) |
| resonance | 0.6 | 0.1–8 Q |
| detune | 12 | 0–40 cents, symmetric unison |
| layerWave | triangle | sine, triangle, sawtooth, square |
| layerMix | 0 | 0–1 |
| layerOctave | 0 | −1, 0, +1 (rounded) |
| layerDetune | 7 | −40 to +40 cents offset |
| filterEnv | 0 | −4000 to +6000 Hz |
| filterAttack | 2 | 0.01–8 seconds |
| filterDecay | 3 | 0.01–10 seconds |
| filterSustain | 0.4 | 0–1 of envelope peak |
| motion | 0.18 | 0.01–3 Hz (demo maximum 2) |
| depth | 650 | 0–2000 Hz filter modulation |
| pitchDepth | 0 | 0–30 cents |
| pitchRate | 0.15 | 0.02–3 Hz |
| panDepth | 0 | 0–1 |
| panRate | 0.09 | 0.02–2 Hz |
| chorus | 0 | 0–1 wet mix |
| chorusRate | 0.22 | 0.05–2 Hz |
| chorusDepth | 0.004 | 0–0.01 seconds (UI displays milliseconds) |
| reverb | 0.42 | 0–1 send |
| delay | 0.2 | 0–1 send; fixed 375 ms, 30% feedback |
| volume | 0.65 | 0–1 master |

Filter attack/decay times compress to fit short notes. Oscillator waveforms are switched directly; the numeric controls are smoothed. A large live waveform change can produce a brief transient. This is a browser JavaScript plugin.

## Timing helpers and project format

`dist/chord-timing.js` exposes `ChordTiming.gateLength(chord)` and `ChordTiming.endBeat(notes, bars)`, shared by the arrangement and export. Durations are quarter-note beats. A chord's occupied timeline region is `start..start+length`; its sounding gate ends at `start+max(0.125,length+transition)`. The final gate can extend two beats into the next loop. WAV export includes that extension.

JSON version 1 contains `name`, `bpm`, `bars`, `preset`, `params`, `loop`, `transition`, `key`, `scale`, `arrangementKey`, `autoVoiceLeading`, `loopStart`, `loopEnd`, `view`, `notes`, and helper `chords`. Loop positions are quarter-note beats; `view` stores zoom, scroll and Follow preferences. Chords include an `id`, root/quality/inversion, start/length, signed `transition`, and optional ascending MIDI `voicing` array. Notes contain MIDI `midi`, `start`, `length`, `velocity`, a note identifier, and optional `chordId` ownership. Import validates timing/pitch, fills missing expressive controls with neutral engine defaults, and migrates older chord metadata. Files over 2 MB are rejected. Browser storage is device/origin specific; download JSON for backups.

## Files and validation

- `dist/ambient-pad.js`: reusable synthesis engine
- `dist/chord-timing.js`: timing helpers
- `dist/harmony.js`: scales, spelling, diatonic chords and voice leading
- `dist/note-editor.js`: group movement, resizing, marquee and clipboard operations
- `dist/navigation.js`: loop bounds, bar:beat parsing, zoom anchors and playback segments
- `tests/navigation-tests.cjs`: run `node tests/navigation-tests.cjs`
- `tests/note-editor-tests.cjs`: run `node tests/note-editor-tests.cjs`
- `dist/index.html`, `dist/app.js`, `dist/style.css`: studio demo
- `tests/harmony-tests.cjs`: run `node tests/harmony-tests.cjs` for key/scale and voice-leading tests
- `tests/project-tests.cjs`: run `node tests/project-tests.cjs` from the project root
- `tests/expressive-audio.html`: browser offline-render tests; serve the project root and open this file
- `tests/audio-check.html`: original dense-note audio smoke test
- `CHANGELOG.md`, `LICENSE`

The project tests cover old-file migration, note ownership, gap/overlap gates, final-tail duration and project roundtrip. Audio tests check that layering, chorus, filter envelopes, pitch drift and pan movement change rendered samples; also test held-note changes and 100 scheduled voices without missing final notes. Browser QA covers fractional chord placement, applying transitions, playback and WAV render completion.

Harmony tests cover diatonic triads/sevenths in all 72 key/scale combinations, sharp/flat spelling, borrowed chords, mixed voice counts, first-chord anchoring, pitch-class preservation, reduced movement around a loop, and 64-chord arrangements. Project tests also check persistence of key, scale, auto mode and voicings. Browser QA covers template loading in harmonic minor, playback, reset/smooth, transposition, suggestion insertion, and saved voicings after reload.

Core editing checks cover rigid group bounds, duration limits, clipboard offsets/velocities, new note IDs, rejected paste atomicity, marquee intersection and actual undo/redo behavior. Browser checks cover Shift selection, marquee selection, group drag/resize, exact paste placement, duplicate, and keyboard undo/redo.

Navigation tests cover pointer-anchored zoom math, loop position/wrapping, held-note seek catch-up, subloop gate trimming, full-clip tails, bar:beat parsing and metronome alignment. Project tests cover cropping/extending through 128 bars and saved loop/view fields. Browser checks cover clip/loop dragging, resize undo, range playback, follow scrolling, seek/paste separation and fitting selected notes.
