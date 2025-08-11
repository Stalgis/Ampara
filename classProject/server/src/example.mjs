import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey:
    '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',
});

const completion = openai.chat.completions.create({
  model: 'gpt-4o-mini',
  store: true,
  messages: [{ role: 'user', content: 'write a haiku about ai' }],
});

completion.then((result) => console.log(result.choices[0].message));
