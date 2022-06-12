# Face smacker

This app uses webcam, to recognize a human face on the screen. When the user clicks on their face, the app alters the appearance as if it was hit. Clicking multiple times ends up in a beaten up face filter.

The app uses p5.js and webgl shaders written in glsl (webcam.vert, webcam.frag).

## How to run?

```sh
cd face-smacker-web
http-server .
```

If you don't have http-server installed:
https://github.com/http-party/http-server#readme