# Sound assets

- `cow-moos-cc0.mp3`: Cow Moos #1 from BigSoundBank, CC0 public domain.
  Source: https://bigsoundbank.com/cow-moos-s0546.html

The "mama calls Niu Lai" sound is generated at runtime with the browser SpeechSynthesis API to avoid embedding copyrighted movie audio.

Optional authorized custom clips:

- `mama.mp3`: a short clip that says "妈妈".
- `niulai.mp3`: a short clip that says "牛来".

If these two files exist, the app randomly plays one of them on click. If they are missing or cannot be played, the app falls back to browser SpeechSynthesis and the CC0 cow moo.
