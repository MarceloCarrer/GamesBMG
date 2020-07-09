//Inicia o Jogo 
function NewGame()
{	
	//Nivel do Jogo
	level = 0;

	//Vidas
	lifes = GAME_LIFES;

    //Pontos
    score = 0;

	//Instância a Nave
	ship = NewShip();
	NewLevel();	
}

//Vida Extra
function LifePlus()
{
	if (scoreLife >= 1000)
	{
		if (lifes < 3)
		{
			lifes++;
		}		
		scoreLife = 0;
	}
	
}

//Próximo Nível
function NewLevel()
{
	textHUD = "NIVEL " + (level + 1);
	textFade = 1.0;
	CreateAsteroidsBelt();	
}

//Fim do Jogo
function GameOver()
{
    ship.dead = true;
    text = "GAME OVER";
	textFade = 1.0;
}