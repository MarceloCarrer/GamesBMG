//Desenha os asteroides 
function Asteroids(lineSize)
{
	var x, y, r, a, vet, offs;

	for (var i = 0; i < roids.length; i++) 
	{
		//Desenha os asteroides 
		ctx.strokeStyle = "slategrey";
		ctx.lineWidth = SHIP_SIZE / lineSize;
		
		x = roids[i].x;
		y = roids[i].y;
		r = roids[i].r;
		a = roids[i].a;
		vert = roids[i].vert;
		offs = roids[i].offs;

		//Desenho do Formato
		ctx.beginPath();
		ctx.moveTo(
			x + r * offs[0] * Math.cos(a),
			y + r * offs[0] * Math.sin(a)
		);

		//Desenho do Poligono
		for (var j = 1; j < vert; j++) 
		{
			ctx.lineTo(
				x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
				y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
			);
		}
		ctx.closePath();
		ctx.stroke();

		//Mostrar ou Ocultar Colisor
		if (SHOW_BOUNDING) 
		{
			ctx.strokeStyle = "lime";
			ctx.beginPath();
			ctx.arc(x, y, r, 0, Math.PI * 2, false);
			ctx.stroke();
		}
	}

	//Verifica Colisão com a Nave
	if (!ship.explodeTime)
	{	if (ship.blinkNum == 0 && !ship.dead) 
		{
			for (var i = 0; i < roids.length; i++) 
			{
				if (DistBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) < ship.r + roids[i].r) 
				{
					ExplodeShip();
					DestroyAsteroid(i);
					break;
				}
			}
		}
	}
	else
	{
		ship.explodeTime--;
		if (ship.explodeTime == 0)
		{
			lifes--;
			if (lifes == 0) 
			{
				GameOver();
			}
			else
			{
				ship = NewShip();
			}
			
		}
	}	
	
	//Movimentação dos Asteroides
	for (var i = 0; i < roids.length; i++) 
	{
		roids[i].x += roids[i].xv;
		roids[i].y += roids[i].yv;

		//Saida das bordas da tela
		if (roids[i].x < 0 - roids[i].r) 
		{
			roids[i].x = canvas.width + roids[i].r;
		}
		else if(roids[i].x > canvas.width + roids[i].r)
		{
			roids[i].x = 0 - roids[i].r
		}

		if (roids[i].y < 0 - roids[i].r) 
		{
			roids[i].y = canvas.height + roids[i].r;
		}
		else if(roids[i].y > canvas.height + roids[i].r)
		{
			roids[i].y = 0 - roids[i].r
		}		
	}

	//Asteroide colide com a Nave cria a Explosão
	function ExplodeShip()
	{
		ship.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * FPS);
		explosionSound.play();
	}	
}