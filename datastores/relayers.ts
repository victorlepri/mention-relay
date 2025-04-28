import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

/**
 * Datastore to track user-to-relayer mappings
 */
const RelayerDatastore = DefineDatastore({
  name: "relayers",
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
      required: true,
    },
    user_id: {
      type: Schema.slack.types.user_id,
      required: true,
    },
    relayer_id: {
      type: Schema.slack.types.user_id,
      required: true,
    },
    channels: {
      type: Schema.types.array,
      items: {
        type: Schema.slack.types.channel_id,
      },
      required: false,
    },
    created_at: {
      type: Schema.types.number,
      required: true,
    },
  },
});

export default RelayerDatastore;
