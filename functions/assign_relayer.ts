import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Function for assigning a relayer to a user
 */
export const AssignRelayerFunction = DefineFunction({
  callback_id: "assign_relayer",
  title: "Assign a Relayer",
  description: "Assigns a user to relay mentions to another user",
  source_file: "./functions/assign_relayer.ts",
  input_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
        description: "User to be monitored for mentions",
      },
      relayer_id: {
        type: Schema.slack.types.user_id,
        description: "User who will receive relay notifications",
      },
    },
    required: ["user_id", "relayer_id"],
  },
  output_parameters: {
    properties: {
      success: {
        type: Schema.types.boolean,
        description: "Whether the relayer was successfully assigned",
      },
      message: {
        type: Schema.types.string,
        description: "Status message",
      },
    },
    required: ["success", "message"],
  },
});

/**
 * Implementation for assigning a relayer
 */
export default SlackFunction(
  AssignRelayerFunction,
  async ({ inputs, client }) => {
    const { user_id, relayer_id } = inputs;

    console.log(`Assigning relayer ${relayer_id} to user ${user_id}`);

    // Validate that user and relayer are different
    if (user_id === relayer_id) {
      return {
        outputs: {
          success: false,
          message: "You cannot relay mentions to yourself.",
        },
      };
    }

    try {
      // Check if this relayer is already assigned to the user
      const existingRelayersResult = await client.apps.datastore.query({
        datastore: "relayers",
        expression: "user_id = :user_id AND relayer_id = :relayer_id",
        expression_values: {
          ":user_id": user_id,
          ":relayer_id": relayer_id,
        },
      });

      if (
        existingRelayersResult.ok && existingRelayersResult.items &&
        existingRelayersResult.items.length > 0
      ) {
        return {
          outputs: {
            success: false,
            message:
              `<@${relayer_id}> is already set up to receive mention notifications for <@${user_id}>.`,
          },
        };
      }

      // Create a unique ID for this relayer relationship
      const id = `${user_id}-${relayer_id}-${Date.now()}`;

      // Create the relayer entry
      const putResult = await client.apps.datastore.put({
        datastore: "relayers",
        item: {
          id,
          user_id,
          relayer_id,
          created_at: Date.now(),
        },
      });

      if (!putResult.ok) {
        console.error(`Error creating relayer: ${putResult.error}`);
        return {
          outputs: {
            success: false,
            message: `Failed to assign relayer: ${putResult.error}`,
          },
        };
      }

      return {
        outputs: {
          success: true,
          message:
            `Successfully set up <@${relayer_id}> to receive mention notifications for <@${user_id}>.`,
        },
      };
    } catch (error) {
      console.error(`Error assigning relayer: ${error}`);
      return {
        outputs: {
          success: false,
          message: `An error occurred: ${error}`,
        },
      };
    }
  },
);
