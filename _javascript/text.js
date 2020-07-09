//Textos em Geral
function TextProp()
{
	//Inicio do Jogo
	if (level == 0 && !ship.dead)
	{
		text = "ASTEROIDS"
	}
	else if(!ship.dead)
	{
		text = "NOVA FASE"
	}

	//Nivel Atual
	if (textFade >= 0)
	{
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "rgba(255, 255, 53, " + textFade + ")";
		ctx.font = "small-caps " + TEXT_SIZE + "px Verdana";
		ctx.fillText(text, canvas.width / 2, canvas.height * 0.75);
		textFade -= (1.0 / TEXT_FADE_TIME / FPS);
	}	
	else if (ship.dead) 
	{
		NewGame();
	}
}

//HUD
function TextHUD(text, align, posX)
{
	ctx.textAlign = align;
	ctx.textBaseline = "middle";
	ctx.fillStyle = "rgba(255, 255, 53)";
	ctx.font = "small-caps " + TEXT_SIZE + "px Verdana";
	ctx.fillText(text, posX, SHIP_SIZE);
}

//Texto de Instrução
function TextInstruct(text, posY)
{
	if (textFadeInst >= 0 && level == 0) 
	{
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "rgba(255, 255, 53, " + textFadeInst + ")";
		ctx.font = "small-caps " + (TEXT_SIZE - 20) + "px Verdana";
		ctx.fillText(text, canvas.width / 2, canvas.height * posY);
		textFadeInst -= (0.5 / TEXT_INST_FADE_TIME / FPS);
	}	
}
