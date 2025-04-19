import { Controller, Post, Body } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Controller('team-of-the-week')
export class AiController {
  @Post()
  async balanceTeams(@Body() players: any[]) {
    console.log('balanceTeams api service ai')
    const prompt = `
    You are an AI soccer analyst.

Given a list of soccer players with their number of goals and number of wins, select the best 5 players to form a "Team of the Week".

Rules:
- Choose exactly 5 players:
  - 2 strikers
  - 2 midfielders
  - 1 defender
- Prioritize players based on:
  - Goals scored (for strikers)
  - Wins contributed to (for all)
  - Balance between individual success (goals) and team success (wins)
- If there is a tie, prefer players with higher wins.

Output format:
Return a JSON object with two keys:
1. \`team\`: an array of 5 selected player names(you must choose 5 different players even if some of them has the same statistics), ordered by position (2 strikers, 2 midfielders, 1 defender)
2. \`explanation\`: an array with 5 different players(you must choose 5 different players even if some of them has the same statistics), each containing:
   - \`player\`: the player's name
   - \`position\`: striker, midfielder, or defender
   - \`goals\`: number of goals
   - \`wins\`: number of wins
   - \`rating\`: a number from 1 to 10 (indicating performance)
   - \`reason\`: a brief, fun, and slightly humorous explanation of why the player was selected. Feel free to add a quirky touch, like "this player is a goal-scoring machine, and they're hotter than a summer afternoon!"


Respond only with string that can be directly converted to JSON object.

    ${JSON.stringify(players)}.`

    console.log(process.env.GROQ_API_KEY)

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gemma2-9b-it',
        messages: [
          { role: 'system', content: 'You help to select the team of the week according to the provided statistics.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    // @ts-ignore
    const result = data.choices?.[0]?.message?.content;
    console.log('result', result)
    if(result) {
      const jsonString = result.match(/```json([\s\S]*?)```/)?.[1]?.trim();
      if (!jsonString) {
        // @ts-ignore
        return JSON.parse(data.choices?.[0]?.message?.content) || {} ;
      }
      return JSON.parse(jsonString);

    }
    // @ts-ignore
    return JSON.parse(data.choices?.[0]?.message?.content)|| {};
  }
}
