# Changelog

## 1.4.1

- Preserve independent notes when adding or editing chord cards; check capacity after replacement.
- Apply completed arrangement edits to live playback at its current position, including non-looping playback.
- Fix drawing into the clicked snap cell and honor Alt-click for unsnapped placement.
- Restore selection, paste cursor and play position when cancelling clip-boundary drags; allow edge scrolling on the next drag.
- Keep the custom sound description consistent when changing the primary waveform.
- Add focused regressions for these review findings.

## 1.4.0

- Add horizontal/vertical zoom, pointer-anchored wheel zoom, fit clip/selection, and zoom shortcuts.
- Replace fixed session sizes with editable 1–128-bar clips and a draggable END handle.
- Add draggable loop start/end markers, range movement, bar:beat inputs, loop selection and full-clip reset.
- Add ruler seeking, held-note catch-up, pause/resume position and optional playhead follow.
- Keep the paste cursor separate via Shift-click on the ruler.
- Keep ruler, loop strip and piano keys visible while scrolling; adapt note/grid detail at small zoom levels.
- Save loop ranges and view preferences; preserve view settings independently of arrangement undo.
- Preserve full-clip WAV export regardless of playback loop range.
- Add navigation and long-clip import/crop regression coverage.

## 1.3.0

- Add Select tool, Shift-click selection and marquee selection.
- Add rigid multi-note movement and group resizing with shared bounds; support Alt-drag to bypass snap.
- Add copy, cut, paste and duplicate with an insert cursor and explicit paste beat.
- Add group velocity editing, keyboard movement/transposition, selection deletion and tool shortcuts.
- Add 100-step arrangement undo/redo with selection restoration and gesture grouping; preserve current sound settings.
- Detach only affected chord helpers after manual note edits.
- Add regression coverage for group bounds, clipboard atomicity and history behavior.

## 1.2.0

- Add key and scale selectors for major, natural minor, Dorian, Mixolydian, Lydian and harmonic minor.
- Show diatonic triad/seventh suggestions, Roman numerals and scale notes; highlight scale tones and tonic in the roll.
- Add diminished, half-diminished, augmented and minor-major qualities needed for diatonic harmony.
- Adapt progression templates to the selected key/scale; add explicit transposition to the selected tonic.
- Add automatic voice leading with first-chord anchoring, compact candidate voicings, and loop-seam optimization.
- Add one-shot smoothing and reset to manual inversion voicings.
- Preserve chord timing, velocities and sound during smoothing; persist voicings/key/scale in projects and use them in WAV exports.
- Keep older projects readable with Auto disabled by default.
- Add harmony coverage across all 72 key/scale combinations and project roundtrip checks.

## 1.1.0

- Add a second oscillator layer with waveform, blend, octave and detune controls.
- Add signed filter envelopes with attack, decay and sustain.
- Add independent slow pitch and pan modulation.
- Add stereo chorus with mix, rate and depth.
- Retune the original six presets; add Slow bloom and Orbit choir.
- Organize synthesis controls into collapsible sections.
- Add quarter-beat chord placement and durations.
- Add per-chord gaps/overlaps and global transition presets.
- Support overlap across the loop seam, display the loop tail, and include it in WAV export.
- Keep old project files readable with neutral defaults for missing synthesis settings.
- Add migration, timing, project-roundtrip and offline audio regression checks.

## 1.0.0

Initial ambient pad synth, piano roll, chord progression templates, project save/load, looping and WAV export.
