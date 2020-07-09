const FPS = 30;
const FRICTION = 0.7;//Freagem da Nave
const GAME_LIFES = 3;//Numero de vidas
const LASER_MAX = 10;//Numero Maximo de Laser em Tela
const LASER_SPEED = 500;//Velocidade do Laser
const LASER_DIST = 0.4;//Distancia Maxima do Laser
const LASER_EXP_DUR = 0.1;//Duração da Explosão do Laser
const ROIDS_JAG = 0.4;//Linha dos Asteroides
const ROIDS_NUM = 3;//Numero de Asteroides
const ROIDS_SIZE = 100;//Tamanho dos Asteroides
const ROIDS_SPD = 50;//Velocidade dos Asteroides
const ROIDS_VERT = 10;//Numero de Vertices dos Asteroides
const ROID_SCORE_LG = 10;//Pontos do Asteriode Grande
const ROID_SCORE_MD = 20;//Pontos do Asteriode Médio
const ROID_SCORE_SM = 30;//Pontos do Asteriode Pequeno
const SHIP_SIZE = 30;//Tamanho da Nave
const SHIP_THRUST = 5;//ACeleração da Nave
const SHIP_EXPLODE_DUR = 0.3;//Duração da Explosão da Nave
const SHIP_BLINK_DUR = 0.1;//Intervalo de Piscar
const SHIP_RESPAWN_TIME = 3;//Tempo para dar Respawn
const SHIP_TURN_SPEED = 360;//Velocidade da Rotação a Nave
const SHOW_BOUNDING = false;//Habilita a Visualização dos Colisores
const TEXT_FADE_TIME = 2.5;//Tempo de Duração
const TEXT_INST_FADE_TIME = 5;//Tempo de Duração
const TEXT_SIZE = 40;//Tamanho da Fonte

/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var roids;
var ship;
var textHUD;
var textFade;
var textFadeInst = 1.0;
var lifes;
var scoreLife = 0;

NewGame();

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

//Loop do Jogo
setInterval(update, 1000 / FPS);

//Cria os asteroides
function CreateAsteroidsBelt()
{
	roids = [];
	var x, y;
	for (var i = 0; i < ROIDS_NUM + level; i++) 
	{	do{
		x = Math.floor(Math.random() * canvas.width);
		y = Math.floor(Math.random() * canvas.height);
		}while(DistBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r);
		roids.push(NewAsteroid(x, y, Math.ceil(ROIDS_SIZE / 2)));
	}
}

//Função para Dividir e Destruir os Asteroides
function DestroyAsteroid(index)
{
	var x = roids[index].x;
	var y = roids[index].y;
	var r = roids[index].r;

	//Divide o Asteroide em 2
	if (r == Math.ceil(ROIDS_SIZE / 2)) 
	{
		roids.push(NewAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
		roids.push(NewAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
		score += ROID_SCORE_LG;
		scoreLife += ROID_SCORE_LG;
	}
	else if (r == Math.ceil(ROIDS_SIZE / 4))
	{
		roids.push(NewAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
		roids.push(NewAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
		score += ROID_SCORE_MD;
		scoreLife += ROID_SCORE_MD;
	}
	else
	{
		score += ROID_SCORE_SM;
		scoreLife += ROID_SCORE_SM;
	}

	//Destroi o Asteroide
	roids.splice(index, 1);	
	laserHitSound.play();

	//Novo Level após Destruir Todos Asteroides
	if (roids.length == 0)
	{
		level++;
		NewLevel();
	}

}

//Não cria Asteroides no meio da tela
function DistBetweenPoints(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

//Define a ação de apertar as teclas no teclado
function keyDown(/** @type {KeyboardEvent} */ ev)
{
	if (ship.dead) 
	{
		return;	
	}

	switch(ev.keyCode)
	{
		case 32: //Barra de Espaço - Atira
			ShootLaser();
		break;
		case 37: //Seta esquerda - gira para esquerda
			ship.rotate = SHIP_TURN_SPEED / 180 * Math.PI / FPS;
		break;
		case 38: //Seta cima anda para frente
			ship.thrusting = true;
		break;
		case 39: //Seta Direita - gira para direita
			ship.rotate = -SHIP_TURN_SPEED / 180 * Math.PI / FPS;
		break;
	}
}

//Define a ação de soltar as teclas no teclado
function keyUp(/** @type {KeyboardEvent} */ ev)
{
	if (ship.dead) 
	{
		return;	
	}

	switch(ev.keyCode)
	{
		case 32: //Barra de Espaço - Atira
			ship.canShoot = true;
		break;
		case 37: //Seta esquerda - para o movimento
			ship.rotate = 0;
		break;
		case 38: //Seta cima - para o movimento
			ship.thrusting = false;
		break;
		case 39: //Seta Direita - para o movimento
			ship.rotate = 0;
		break;
	}
}

//Cria novos asteroides em novas posições
function NewAsteroid(x, y, r)
{
	var levelAdd = 1 + 0.1 * level;
	var roid = {
		x: x,
		y: y,
		xv: Math.random() * ROIDS_SPD * levelAdd / FPS * (Math.random() < 0.5 ? 1 : -1),
		yv: Math.random() * ROIDS_SPD * levelAdd / FPS * (Math.random() < 0.5 ? 1 : -1),
		r: r,
		a: Math.random() * Math.PI * 2, 
		vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2),
		offs: []
	};

	for (var i = 0; i < roid.vert; i++) 
	{
		roid.offs.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG);
	}

	return roid;
}

//Propriedades da Nave
function NewShip()
{
	return {
		x: canvas.width / 2,
		y: canvas.height / 2,
		r: SHIP_SIZE / 2,
		a: 90 / 180 * Math.PI,
		blinkNum: Math.ceil(SHIP_RESPAWN_TIME / SHIP_BLINK_DUR),
		blinkTime: Math.ceil(SHIP_BLINK_DUR * FPS),
		dead: false,
		canShoot: true,
		explodeTime: 0,
		lasers: [],
		rotate: 0,
		thrusting: false,
		thrust: {
			x: 0,
			y: 0,
		}
	}
}

function update()
{
	var blinkOn = ship.blinkNum % 2 == 0;
	var exploding = ship.explodeTime > 0;
	
	DrawSpace("black");
	TextInstruct("MOVIMENTO: SETAS", 0.9);
	TextInstruct("TIRO: ESPAÇO", 0.95);
	if (!exploding) 
	{
		if (blinkOn && !ship.dead) 
		{
			MovShip();
			DrawShip("skyblue", 20, ship.x, ship.y, ship.a);
		}
		if (ship.blinkNum > 0) 
		{
			ship.blinkTime--;
		}		
		if (ship.blinkTime == 0) 
		{
			ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
			ship.blinkNum--;
		}
	}
	else
	{
		ExplodeShip();
	}
	DrawShootLaser();
	TextProp();
	TextHUD(score, "right", canvas.width - SHIP_SIZE / 2);
	TextHUD(textHUD, "center", canvas.width / 2);
	LaserCollision();
	DrawShipLifes();
	Asteroids(20);	
	LifePlus();
}









