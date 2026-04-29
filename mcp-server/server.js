const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'https://graph.facebook.com/v20.0';
const TOKEN = process.env.META_ACCESS_TOKEN;
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;
const LANDING_PAGE = process.env.LANDING_PAGE_URL || 'https://agentrealm.org';

if (!TOKEN || !AD_ACCOUNT_ID) {
  console.error('❌ Missing META_ACCESS_TOKEN or META_AD_ACCOUNT_ID in .env file.');
  process.exit(1);
}

const audiences = {
  business: {
    name: 'Business Owners',
    targeting: {
      geo_locations: { countries: ['US'] },
      interests: [
        { id: 6003107902433, name: 'Small business' },
        { id: 6003139265470, name: 'Entrepreneurship' },
        { id: 6003331835125, name: 'Shopify' },
      ],
      age_min: 25,
      age_max: 55,
    },
  },
  lawyers: {
    name: 'Lawyers',
    targeting: {
      geo_locations: { countries: ['US'] },
      interests: [
        { id: 6003087902433, name: 'Law' },
        { id: 6003107902433, name: 'Legal technology' },
      ],
      age_min: 28,
      age_max: 60,
    },
  },
  coaches: {
    name: 'Coaches',
    targeting: {
      geo_locations: { countries: ['US'] },
      interests: [
        { id: 6003107902433, name: 'Athletic coaching' },
        { id: 6003139265470, name: 'Personal training' },
      ],
      age_min: 22,
      age_max: 50,
    },
  },
};

const adCopy = {
  business: {
    primary: 'You are still pulling reports manually and guessing what to do next. We build you an AI agent that reads your data and tells you what matters today. Built around your business. Not a template.',
    headline: 'Your Own AI Agent. Built Around Your Workflow.',
    description: 'No templates. No generic setup. We build it for how you actually work.',
  },
  lawyers: {
    primary: 'You are spending 6 hours scanning paperwork that an agent could summarize in minutes. We build it around your case types, your clauses, your process.',
    headline: 'Scan Thousands of Pages in Minutes.',
    description: 'AI agents built for legal workflows. Summarize, compare, and find key clauses fast.',
  },
  coaches: {
    primary: 'Scout athletes against your own benchmarks. Let your agent compare, flag, and rank for you. More athletes evaluated, clearer decisions.',
    headline: 'Scout Athletes Against Your Benchmarks.',
    description: 'AI agents built for coaches. Compare metrics, flag matches, evaluate faster.',
  },
};

const server = new Server(
  { name: 'agent-realm-ads', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'create_campaign',
      description: 'Creates a new Meta ad campaign with ad sets and ads for specified audiences.',
      inputSchema: {
        type: 'object',
        properties: {
          campaignName: { type: 'string', description: 'Name for the campaign' },
          dailyBudget: { type: 'number', description: 'Daily budget per ad set in USD' },
          audiences: { type: 'array', items: { type: 'string' }, description: 'List of audiences: business, lawyers, coaches' },
          activate: { type: 'boolean', description: 'Whether to activate immediately or keep paused' },
        },
        required: ['campaignName', 'dailyBudget', 'audiences'],
      },
    },
    {
      name: 'list_campaigns',
      description: 'Lists all campaigns in the ad account with their status and basic info.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'update_campaign',
      description: 'Updates a campaign status (ACTIVE/PAUSED) or budget.',
      inputSchema: {
        type: 'object',
        properties: {
          campaignId: { type: 'string', description: 'Campaign ID to update' },
          status: { type: 'string', description: 'ACTIVE or PAUSED' },
          dailyBudget: { type: 'number', description: 'New daily budget (optional)' },
        },
        required: ['campaignId'],
      },
    },
    {
      name: 'get_insights',
      description: 'Gets performance insights (clicks, spend, CTR, leads) for a campaign or ad set.',
      inputSchema: {
        type: 'object',
        properties: {
          campaignId: { type: 'string', description: 'Campaign ID' },
          adSetId: { type: 'string', description: 'Ad Set ID (optional)' },
          datePreset: { type: 'string', description: 'Date range: today, yesterday, last_7d, last_30d' },
        },
        required: ['campaignId'],
      },
    },
    {
      name: 'get_ad_account',
      description: 'Gets ad account details including balance, currency, and status.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'check_token',
      description: 'Checks if the Meta API token is still valid.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'duplicate_and_scale',
      description: 'Duplicates a winning ad set and increases its budget by a percentage.',
      inputSchema: {
        type: 'object',
        properties: {
          adSetId: { type: 'string', description: 'Ad Set ID to duplicate' },
          budgetIncreasePercent: { type: 'number', description: 'Percentage to increase budget (e.g., 20 for 20%)' },
        },
        required: ['adSetId', 'budgetIncreasePercent'],
      },
    },
    {
      name: 'update_ad_creative',
      description: 'Updates the primary text, headline, or description of an existing ad.',
      inputSchema: {
        type: 'object',
        properties: {
          adId: { type: 'string', description: 'Ad ID to update' },
          primaryText: { type: 'string', description: 'New primary text' },
          headline: { type: 'string', description: 'New headline' },
          description: { type: 'string', description: 'New description' },
        },
        required: ['adId'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'create_campaign': {
        const { campaignName, dailyBudget, audiences: audienceKeys, activate = false } = args;
        const results = { campaignId: '', adSets: [] };

        // Create campaign
        const campaignRes = await axios.post(`${BASE_URL}/act_${AD_ACCOUNT_ID}/campaigns`, null, {
          params: {
            name: campaignName,
            objective: 'TRAFFIC',
            status: 'PAUSED',
            access_token: TOKEN,
          },
        });
        results.campaignId = campaignRes.data.id;

        // Create ad sets and ads
        for (const key of audienceKeys) {
          if (!audiences[key]) continue;
          const audience = audiences[key];
          const copy = adCopy[key];

          const adSetRes = await axios.post(`${BASE_URL}/act_${AD_ACCOUNT_ID}/adsets`, null, {
            params: {
              name: `${audience.name} - Agent Realm`,
              campaign_id: results.campaignId,
              daily_budget: dailyBudget * 100,
              billing_event: 'IMPRESSIONS',
              optimization_goal: 'LINK_CLICKS',
              targeting: JSON.stringify(audience.targeting),
              status: 'PAUSED',
              access_token: TOKEN,
            },
          });
          const adSetId = adSetRes.data.id;

          await axios.post(`${BASE_URL}/act_${AD_ACCOUNT_ID}/ads`, null, {
            params: {
              name: `Agent Realm - ${audience.name}`,
              adset_id: adSetId,
              creative: JSON.stringify({
                name: `Agent Realm - ${audience.name} Creative`,
                object_story_spec: {
                  page_id: null,
                  link_data: {
                    link: LANDING_PAGE,
                    message: copy.primary,
                    name: copy.headline,
                    description: copy.description,
                    call_to_action: { type: 'LEARN_MORE', value: { link: LANDING_PAGE } },
                  },
                },
              }),
              status: 'PAUSED',
              access_token: TOKEN,
            },
          });

          results.adSets.push({ id: adSetId, audience: audience.name });
        }

        if (activate) {
          await axios.post(`${BASE_URL}/${results.campaignId}`, null, {
            params: { status: 'ACTIVE', access_token: TOKEN },
          });
          for (const adSet of results.adSets) {
            await axios.post(`${BASE_URL}/${adSet.id}`, null, {
              params: { status: 'ACTIVE', access_token: TOKEN },
            });
          }
          results.status = 'ACTIVE';
        } else {
          results.status = 'PAUSED';
        }

        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }

      case 'list_campaigns': {
        const res = await axios.get(`${BASE_URL}/act_${AD_ACCOUNT_ID}/campaigns`, {
          params: { fields: 'id,name,status,objective,daily_budget', access_token: TOKEN },
        });
        return { content: [{ type: 'text', text: JSON.stringify(res.data.data, null, 2) }] };
      }

      case 'update_campaign': {
        const { campaignId, status, dailyBudget } = args;
        const params = { access_token: TOKEN };
        if (status) params.status = status;
        if (dailyBudget) params.daily_budget = dailyBudget * 100;

        await axios.post(`${BASE_URL}/${campaignId}`, null, { params });
        return { content: [{ type: 'text', text: `Campaign ${campaignId} updated successfully.` }] };
      }

      case 'get_insights': {
        const { campaignId, adSetId, datePreset = 'last_7d' } = args;
        const objectId = adSetId || campaignId;
        const level = adSetId ? 'adset' : 'campaign';

        const res = await axios.get(`${BASE_URL}/${objectId}/insights`, {
          params: {
            fields: 'spend,clicks,ctr,reach,impressions,actions',
            date_preset: datePreset,
            level,
            access_token: TOKEN,
          },
        });
        return { content: [{ type: 'text', text: JSON.stringify(res.data.data, null, 2) }] };
      }

      case 'get_ad_account': {
        const res = await axios.get(`${BASE_URL}/act_${AD_ACCOUNT_ID}`, {
          params: { fields: 'account_status,amount_spent,balance,currency,name', access_token: TOKEN },
        });
        return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
      }

      case 'check_token': {
        const res = await axios.get(`${BASE_URL}/me`, {
          params: { fields: 'id,name', access_token: TOKEN },
        });
        return { content: [{ type: 'text', text: `Token is valid. User: ${res.data.name} (ID: ${res.data.id})` }] };
      }

      case 'duplicate_and_scale': {
        const { adSetId, budgetIncreasePercent } = args;

        // Get original ad set details
        const original = await axios.get(`${BASE_URL}/${adSetId}`, {
          params: { fields: 'name,daily_budget,targeting,campaign_id,optimization_goal,billing_event', access_token: TOKEN },
        });
        const data = original.data;
        const newBudget = Math.round(data.daily_budget * (1 + budgetIncreasePercent / 100));

        // Create duplicate
        const res = await axios.post(`${BASE_URL}/act_${AD_ACCOUNT_ID}/adsets`, null, {
          params: {
            name: `${data.name} (Scaled)`,
            campaign_id: data.campaign_id,
            daily_budget: newBudget,
            billing_event: data.billing_event,
            optimization_goal: data.optimization_goal,
            targeting: JSON.stringify(data.targeting),
            status: 'PAUSED',
            access_token: TOKEN,
          },
        });

        return {
          content: [
            { type: 'text', text: JSON.stringify({ newAdSetId: res.data.id, oldBudget: data.daily_budget, newBudget }, null, 2) },
          ],
        };
      }

      case 'update_ad_creative': {
        const { adId, primaryText, headline, description } = args;

        // Get current creative
        const current = await axios.get(`${BASE_URL}/${adId}`, {
          params: { fields: 'creative{object_story_spec}', access_token: TOKEN },
        });
        const storySpec = current.data.creative.object_story_spec;

        // Update fields
        if (primaryText) storySpec.link_data.message = primaryText;
        if (headline) storySpec.link_data.name = headline;
        if (description) storySpec.link_data.description = description;

        await axios.post(`${BASE_URL}/${adId}`, null, {
          params: {
            creative: JSON.stringify({
              name: current.data.creative.name,
              object_story_spec: storySpec,
            }),
            access_token: TOKEN,
          },
        });

        return { content: [{ type: 'text', text: `Ad ${adId} creative updated successfully.` }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMsg = error.response?.data || error.message;
    return { content: [{ type: 'text', text: `Error: ${JSON.stringify(errorMsg)}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Agent Realm Ads MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
