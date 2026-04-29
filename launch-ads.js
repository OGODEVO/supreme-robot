const axios = require('axios');
const config = require('./meta-config');

const BASE_URL = 'https://graph.facebook.com/v20.0';
const TOKEN = config.accessToken;
const AD_ACCOUNT_ID = config.adAccountId;
const LANDING_PAGE = config.landingPageUrl;

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

async function createCampaign(name, objective = 'TRAFFIC') {
  console.log(`\n🚀 Creating campaign: ${name}`);
  const res = await axios.post(`${BASE_URL}/act_${AD_ACCOUNT_ID}/campaigns`, null, {
    params: {
      name,
      objective,
      status: 'PAUSED',
      access_token: TOKEN,
    },
  });
  console.log(`✅ Campaign created: ${res.data.id}`);
  return res.data.id;
}

async function createAdSet(campaignId, audienceKey, dailyBudget = 10) {
  const audience = audiences[audienceKey];
  console.log(`\n🎯 Creating ad set: ${audience.name}`);
  const res = await axios.post(`${BASE_URL}/act_${AD_ACCOUNT_ID}/adsets`, null, {
    params: {
      name: `${audience.name} - Agent Realm`,
      campaign_id: campaignId,
      daily_budget: dailyBudget * 100,
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'LINK_CLICKS',
      targeting: JSON.stringify(audience.targeting),
      status: 'PAUSED',
      access_token: TOKEN,
    },
  });
  console.log(`✅ Ad set created: ${res.data.id}`);
  return res.data.id;
}

async function createAd(adSetId, audienceKey) {
  const copy = adCopy[audienceKey];
  console.log(`\n📝 Creating ad for: ${audiences[audienceKey].name}`);
  const res = await axios.post(`${BASE_URL}/act_${AD_ACCOUNT_ID}/ads`, null, {
    params: {
      name: `Agent Realm - ${audiences[audienceKey].name}`,
      adset_id: adSetId,
      creative: JSON.stringify({
        name: `Agent Realm - ${audiences[audienceKey].name} Creative`,
        object_story_spec: {
          page_id: null,
          link_data: {
            link: LANDING_PAGE,
            message: copy.primary,
            name: copy.headline,
            description: copy.description,
            call_to_action: {
              type: 'LEARN_MORE',
              value: { link: LANDING_PAGE },
            },
          },
        },
      }),
      status: 'PAUSED',
      access_token: TOKEN,
    },
  });
  console.log(`✅ Ad created: ${res.data.id}`);
  return res.data.id;
}

async function launchCampaign(campaignId) {
  console.log(`\n🟢 Activating campaign: ${campaignId}`);
  await axios.post(`${BASE_URL}/${campaignId}`, null, {
    params: {
      status: 'ACTIVE',
      access_token: TOKEN,
    },
  });
  console.log('✅ Campaign is now ACTIVE');
}

async function launchAdSets(adSetIds) {
  for (const id of adSetIds) {
    console.log(`\n🟢 Activating ad set: ${id}`);
    await axios.post(`${BASE_URL}/${id}`, null, {
      params: {
        status: 'ACTIVE',
        access_token: TOKEN,
      },
    });
    console.log(`✅ Ad set ${id} is now ACTIVE`);
  }
}

async function main() {
  const campaignName = process.argv[2] || `Agent Realm - ${new Date().toISOString().split('T')[0]}`;
  const dailyBudget = parseInt(process.argv[3]) || 10;
  const audiencesToLaunch = process.argv.slice(4).length > 0 ? process.argv.slice(4) : ['business', 'lawyers', 'coaches'];

  console.log('🤖 Agent Realm Ads Launcher');
  console.log('==========================');
  console.log(`Campaign: ${campaignName}`);
  console.log(`Budget: $${dailyBudget}/day per ad set`);
  console.log(`Audiences: ${audiencesToLaunch.join(', ')}`);
  console.log(`Landing Page: ${LANDING_PAGE}`);

  try {
    const campaignId = await createCampaign(campaignName);
    const adSetIds = [];

    for (const key of audiencesToLaunch) {
      if (!audiences[key]) {
        console.log(`⚠️ Unknown audience: ${key}. Skipping.`);
        continue;
      }
      const adSetId = await createAdSet(campaignId, key, dailyBudget);
      await createAd(adSetId, key);
      adSetIds.push(adSetId);
    }

    console.log('\n📋 Summary:');
    console.log(`Campaign ID: ${campaignId}`);
    console.log(`Ad Sets: ${adSetIds.join(', ')}`);
    console.log('\n⚠️ Campaign and ads are created but PAUSED.');
    console.log('To activate, run:');
    console.log(`  node launch-ads.js "${campaignName}" ${dailyBudget} ${audiencesToLaunch.join(' ')} --activate`);

    if (process.argv.includes('--activate')) {
      await launchCampaign(campaignId);
      await launchAdSets(adSetIds);
      console.log('\n🎉 All ads are now LIVE!');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
  }
}

main();
