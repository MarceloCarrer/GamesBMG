var laserSound = new Sound("_sounds/laser.m4a", 5, 0.5);
var explosionSound = new Sound("_sounds/explode.m4a");
var laserHitSound = new Sound("_sounds/hit.m4a", 5);

//Configuração dos Sons
function Sound(src, maxStreams = 1, vol = 1.0)
{
    this.streamNum = 0;
    this.streams = [];
    for (var i = 0; i < maxStreams; i++) 
    {
        this.streams.push(new Audio(src));
        this.streams[i].volume = vol;
    }

    this.play = function () 
    {
        this.streamNum = (this.streamNum + 1) % maxStreams;
        this.streams[this.streamNum].play();
    }
}