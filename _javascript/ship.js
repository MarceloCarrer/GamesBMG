//Propriedades da Nave

function ShipProp()
{
	return x, y, r;
}

//Desenho da Nave
function DrawShip(colorLine, lineSize, x, y, a)
{
	//Ponto Central
	ctx.fillStyle = "red";
	ctx.fillRect(x - 2, y - 4, 4, 4);
	
	ctx.strokeStyle = colorLine;
	ctx.lineWidth = SHIP_SIZE / lineSize;
	ctx.beginPath();
		//Ponto 1 
	ctx.moveTo(
		x + 4 / 3 * ship.r * Math.cos(a),
		y - 4 / 3 * ship.r * Math.sin(a)
	);
		//Ponto 2
	ctx.lineTo(
		x - ship.r * (2 / 3 * Math.cos(a) + Math.sin(a)),
		y + ship.r * (2 / 3 * Math.sin(a) - Math.cos(a))
	);
		//Ponto 3
	ctx.lineTo(
		x - ship.r * (2 / 3 * Math.cos(a) - Math.sin(a)),
		y + ship.r * (2 / 3 * Math.sin(a) + Math.cos(a))
	);
	
	ctx.closePath();
	ctx.stroke();	
	
	if (SHOW_BOUNDING) 
	{
		ctx.strokeStyle = "lime";
		ctx.beginPath();
		ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false);
		ctx.stroke();
	}	
}

//Efeito da Explosão da Nave
function ExplodeShip()
{
	ctx.fillStyle = "darkred";
	ctx.beginPath();
	ctx.arc(ship.x, ship.y, ship.r * 1.9, 0, Math.PI * 2, false);
	ctx.fillStyle = "red";
	ctx.beginPath();
	ctx.arc(ship.x, ship.y, ship.r * 1.4, 0, Math.PI * 2, false);
	ctx.fill();
	ctx.fillStyle = "orange";
	ctx.beginPath();
	ctx.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI * 2, false);
	ctx.fill();
	ctx.fillStyle = "yellow";
	ctx.beginPath();
	ctx.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI * 2, false);
	ctx.fill();
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.arc(ship.x, ship.y, ship.r * 0.5, 0, Math.PI * 2, false);
	ctx.fill();
}

//Desenho do Fogo do Motor
function DrawThruster(colorFill, colorLine, lineSize)
{	
	ctx.fillStyle = colorFill;
	ctx.strokeStyle = colorLine;
	ctx.lineWidth = SHIP_SIZE / lineSize;
	ctx.beginPath();
		//Lado Esquerdo
	ctx.moveTo(
		ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
		ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
	);
		//Centro
	ctx.lineTo(
		ship.x - ship.r * 6 / 3 * Math.cos(ship.a),
		ship.y + ship.r * 6 / 3 * Math.sin(ship.a)
	);
		//Lado Direito
	ctx.lineTo(
		ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
		ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
	);		
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

//Movimentação da Nave
function MovShip()
{	
	ship.x += ship.thrust.x;
	ship.y += ship.thrust.y;

	//Rotação da Nave
	ship.a += ship.rotate;

	//Impulso da Nave
	if (ship.thrusting && !ship.dead) 
	{
		ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / FPS;
		ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / FPS;
		DrawThruster("red", "yellow", 10);
	}
	else
	{
		ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
		ship.thrust.y -= FRICTION * ship.thrust.y / FPS;
	}

	//Saida das bordas da tela
	if (ship.x < 0 - ship.r) 
	{
		ship.x = canvas.width + ship.r;	
	}
	else if (ship.x > canvas.width + ship.r) 
	{
		ship.x = 0 - ship.r;
	}
	if (ship.y < 0 - ship.r) 
	{
		ship.y = canvas.height + ship.r;	
	}
	else if (ship.y > canvas.height + ship.r) 
	{
		ship.y = 0 - ship.r;
	}
}

//Tiro Laser pelo Bico da Nave
function ShootLaser()
{
	if (ship.canShoot && ship.lasers.length < LASER_MAX) 
	{
		ship.lasers.push({
			x: ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
			y: ship.y - 4 / 3 * ship.r * Math.sin(ship.a),
			xv: LASER_SPEED * Math.cos(ship.a) / FPS,
			yv: -LASER_SPEED * Math.sin(ship.a) / FPS,
			dist: 0,
			explodeTime: 0
		});		
		laserSound.play();	
	}

	//Para Evitar Disparos em Excesso
	ship.canShoot = false;
}

//Desenhando o Laser
function DrawShootLaser()
{
	for (var i = 0; i < ship.lasers.length; i++) 
	{
		if (ship.lasers[i].explodeTime == 0) 
		{
			ctx.fillStyle = "salmon";
			ctx.beginPath();
			ctx.arc(ship.lasers[i].x, ship.lasers[i].y, SHIP_SIZE / 15, 0, Math.PI * 2, false);
			ctx.fill();
		}
		else
		{
			ctx.fillStyle = "orangered";
			ctx.beginPath();
			ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.75, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.fillStyle = "salmon";
			ctx.beginPath();
			ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.5, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.fillStyle = "pink";
			ctx.beginPath();
			ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.25, 0, Math.PI * 2, false);
			ctx.fill();
		}
	}

	//Movimentação e Efeitos dos Lasers
	for (var j = ship.lasers.length - 1; j >= 0; j--) 
	{	
		//Verifica a Distancia 
		if (ship.lasers[j].dist > LASER_DIST * canvas.width) 
		{
			ship.lasers.splice(j, 1);
			continue;
		}
		
		//Explosão do Laser
		if (ship.lasers[j].explodeTime > 0) 
		{
			ship.lasers[j].explodeTime--;

			if (ship.lasers[j].explodeTime == 0) 
			{
				 ship.lasers.splice(j, 1);
				 continue;
			}
		}
		else
		{
			//Movimento do Laser
			ship.lasers[j].x += ship.lasers[j].xv;
			ship.lasers[j].y += ship.lasers[j].yv;

			//Calcula a Distancia que o Laser Percorre
			ship.lasers[j].dist += Math.sqrt(Math.pow(ship.lasers[j].xv, 2) + Math.pow(ship.lasers[j].yv, 2));
		}

		//Saida das bordas da tela
		if (ship.lasers[j].x < 0) 
		{
			ship.lasers[j].x = canvas.width;
		}
		else if (ship.lasers[j].x > canvas.width) 
		{
			ship.lasers[j].x = 0;
		}

		if (ship.lasers[j].y < 0) 
		{
			ship.lasers[j].y = canvas.height;
		}
		else if (ship.lasers[j].y > canvas.h) 
		{
			ship.lasers[j].y = 0;
		}
	}
}

//Colisão do Laser com Asteroide
function LaserCollision()
{
	var ax, ay, ar, lx, ly;

	for (var i = roids.length - 1; i >= 0; i--) 
	{
		ax = roids[i].x;
		ay = roids[i].y;
		ar = roids[i].r;

		for (var j = ship.lasers.length - 1; j >= 0; j--)
		{
			lx = ship.lasers[j].x;
			ly = ship.lasers[j].y;

			if (ship.lasers[j].explodeTime == 0 && DistBetweenPoints(ax, ay, lx, ly) < ar) 
			{
				//Destroi o Asteroide e Ativa o Explosão do Laser
				DestroyAsteroid(i);
				ship.lasers[j].explodeTime = Math.ceil(LASER_EXP_DUR * FPS);
				break;
			}				
		}
	}
}

//Desenhando as Vidas
function DrawShipLifes()
{
	for (var i = 0; i < lifes; i++) {
		
		DrawShip("skyblue", 20, SHIP_SIZE + i * SHIP_SIZE * 1.2, SHIP_SIZE, 0.5 * Math.PI);		
	}
}