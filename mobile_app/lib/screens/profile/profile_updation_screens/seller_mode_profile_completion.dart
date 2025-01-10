// ignore_for_file: use_build_context_synchronously

import 'package:e_commerce/common/buttons/custom_gradient_button.dart';
import 'package:e_commerce/common/snakbar/custom_snakbar.dart';
import 'package:e_commerce/common/text_form_fields/custom_text_form_field.dart';
import 'package:e_commerce/providers/authentication/authentication_provider.dart';
import 'package:e_commerce/providers/profile_updation/profile_updation_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

class SellerModeProfileCompletion extends StatelessWidget {
  const SellerModeProfileCompletion({super.key});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    Brightness brightness = Theme.of(context).brightness;
    bool isDarkMode = brightness == Brightness.dark;

    return Consumer2<ProfileUpdationProvider, AuthenticationProvider>(
      builder: (context, profileUpdationProvider, authProvider, child) {
        return Scaffold(
          appBar: AppBar(
            centerTitle: true,
            title: const Text(
              "Complete Your Seller Profile",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ),
          body: SafeArea(
            child: SingleChildScrollView(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: size.width * 0.05),
                child: Form(
                  key: profileUpdationProvider.sellerProfileCompleteFormKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Tell customers and service providers about yourself and why you’re a reasonable.",
                        style: TextStyle(
                          fontSize: 12,
                          color:
                              isDarkMode ? Colors.white : Colors.grey.shade600,
                        ),
                      ),
                      const SizedBox(
                        height: 12,
                      ),
                      CustomTextFormField(
                        label: 'Qualification',
                        maxLines: 3,
                        controller:
                            profileUpdationProvider.qualificationController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Qualfication Cannot be empty.';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(
                        height: 12,
                      ),
                      CustomTextFormField(
                        label: 'Experience',
                        maxLines: 3,
                        controller:
                            profileUpdationProvider.experienceController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your experience';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(
                        height: 12,
                      ),
                      CustomTextFormField(
                        label: 'Description',
                        maxLines: 3,
                        controller:
                            profileUpdationProvider.descriptionController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your description';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 15),
                      CustomGradientButton(
                        text: "Update",
                        onPressed: () async {
                          // Check if the gender is selected
                          // Proceed to validate the rest of the form
                          if (profileUpdationProvider
                              .validateSellerProfileUpdationForm()) {
                            final statusCode =
                                await authProvider.completeSellerProfile(
                              profileUpdationProvider
                                  .qualificationController.text,
                              profileUpdationProvider.experienceController.text
                                  .trim(),
                              profileUpdationProvider.descriptionController.text
                                  .trim(),
                            );
                            // Handle navigation based on status code
                            if (statusCode == 200) {
                              showCustomSnackBar(
                                context,
                                "Your Seller Profile Has Been Updated!",
                                Colors.green,
                              );
                              authProvider.getProfileCompletion();
                              authProvider.getUserData();
                              Navigator.pop(context);
                            } else {
                              showCustomSnackBar(
                                context,
                                "Updation failed. Please try again.",
                                Colors.red,
                              );
                            }
                          }
                        },
                        isLoading: authProvider.isLoading,
                      ),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
