import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Function to remove a user's relayer
 */
export const RemoveRelayerFunction = DefineFunction({
  callback_id: "remove_relayer_function",
  title: "Remove Relayer",
  description: "Removes the assigned relayer for mentions",
  source_file: "functions/remove_relayer.ts",
  input_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
        description: "The user who wants to remove their relayer",
      },
    },
    required: ["user_id"],
  },
  output_parameters: {
    properties: {
      success: {
        type: Schema.types.boolean,
        description: "Whether the operation was successful",
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
 * Implementation of the remove relayer function
 */
export default SlackFunction(
  RemoveRelayerFunction,
  async ({ inputs, client }) => {
    const { user_id } = inputs;

    try {
      // Check if the user has a relayer configured
      const existingMapping = await client.apps.datastore.get({
        datastore: "relayers",
        id: user_id,
      });

      if (!existingMapping.item) {
        return {
          outputs: {
            success: false,
            message: "You don't have a relayer configured.",
          },
        };
      }

      // Delete the relayer mapping from the datastore
      await client.apps.datastore.delete({
        datastore: "relayers",
        id: user_id,
      });

      return {
        outputs: {
          success: true,
          message: "Successfully removed your relayer.",
        },
      };
    } catch (error) {
      console.error("Error assigning relayer:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        outputs: {
          success: false,
          message: `Failed to assign relayer: ${errorMessage}`,
        },
      };
    }
  }
);
