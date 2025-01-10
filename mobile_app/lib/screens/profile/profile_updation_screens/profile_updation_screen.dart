// ignore_for_file: use_build_context_synchronously

import 'package:e_commerce/common/buttons/custom_gradient_button.dart';
import 'package:e_commerce/common/snakbar/custom_snakbar.dart';
import 'package:e_commerce/common/text_form_fields/custom_text_form_field.dart';
import 'package:e_commerce/providers/authentication/authentication_provider.dart';
import 'package:e_commerce/providers/profile_updation/profile_updation_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

class ProfileCompleteScreen extends StatelessWidget {
  const ProfileCompleteScreen({super.key});

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
              "Complete Your Buyer Profile",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ),
          body: SafeArea(
            child: SingleChildScrollView(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: size.width * 0.05),
                child: Form(
                  key: profileUpdationProvider.profileCompleteFormKey,
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
                        maxLines: 2,
                        label: 'Bio',
                        controller: profileUpdationProvider.bioController,
                        validator: (value) {
                          if (value == null) {
                            return 'Please select enter bio';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(
                        height: 12,
                      ),
                      CustomTextFormField(
                        label: 'CNIC (XXXXX-XXXXXXX-X)',
                        controller: profileUpdationProvider.idnumberController,
                        validator: (value) {
                          // Regex to validate the Pakistani CNIC format: #####-#######-#
                          final cnicRegex = RegExp(r'^\d{5}-\d{7}-\d{1}$');

                          if (value == null || value.isEmpty) {
                            return 'CNIC';
                          } else if (!cnicRegex.hasMatch(value)) {
                            return 'CNIC must be in the format XXXXX-XXXXXXX-X';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(
                        height: 12,
                      ),
                      DropdownButtonFormField<String>(
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: isDarkMode
                              ? ThemeData().scaffoldBackgroundColor
                              : Colors.white,
                          labelStyle: TextStyle(
                              color: isDarkMode
                                  ? Colors.white
                                  : Colors.grey.shade500,
                              fontSize: 14),
                          labelText: 'Gender',
                          border: OutlineInputBorder(
                            borderSide: const BorderSide(width: 0.5),
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        value: profileUpdationProvider
                            .selectedGender, // Use the selectedGender from provider
                        items: const [
                          DropdownMenuItem(value: 'male', child: Text('Male')),
                          DropdownMenuItem(
                              value: 'female', child: Text('Female')),
                          DropdownMenuItem(
                              value: 'other', child: Text('Other')),
                        ],
                        onChanged: (value) {
                          if (value != null) {
                            profileUpdationProvider.updateGender(
                                value); // Update gender in the provider
                          }
                        },

                        validator: (value) {
                          if (value == null) {
                            return 'Please select your gender';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(
                        height: 12,
                      ),
                      CustomTextFormField(
                        label: 'Country',
                        controller:
                            profileUpdationProvider.addressCountryController,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your country';
                          } else if (!RegExp(r'^[a-zA-Z\s]+$')
                              .hasMatch(value)) {
                            return 'Country must be a\nstring of characters';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(
                        height: 12,
                      ),
                      Row(
                        children: [
                          Expanded(
                            child: CustomTextFormField(
                              label: 'State',
                              controller: profileUpdationProvider
                                  .addressStateController,
                              keyboardType: TextInputType.name,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter your state';
                                }
                                return null;
                              },
                            ),
                          ),
                          const SizedBox(
                            width: 12,
                          ),
                          Expanded(
                            child: CustomTextFormField(
                              label: 'City',
                              controller:
                                  profileUpdationProvider.addresCityController,
                              keyboardType: TextInputType.name,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter your country';
                                } else if (!RegExp(r'^[a-zA-Z\s]+$')
                                    .hasMatch(value)) {
                                  return 'Country must be a\nstring of characters';
                                }
                                return null;
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(
                        height: 12,
                      ),
                      Row(
                        children: [
                          Expanded(
                            child: CustomTextFormField(
                              label: 'Street No',
                              controller: profileUpdationProvider
                                  .addressStreetNumberController,
                              keyboardType: TextInputType.number,
                              inputFormatters: [
                                FilteringTextInputFormatter.digitsOnly
                              ],
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter your\nstreet no';
                                }
                                return null;
                              },
                            ),
                          ),
                          const SizedBox(
                            width: 10,
                          ),
                          Expanded(
                              child: CustomTextFormField(
                            label: 'Postal Code',
                            controller: profileUpdationProvider
                                .addressPostalCodeController,
                            keyboardType: TextInputType.number,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter your postal code';
                              } else if (!RegExp(r'^\d+$').hasMatch(value)) {
                                return 'Postal Code must\nbe numbers only';
                              }
                              return null;
                            },
                          )),
                        ],
                      ),
                      const SizedBox(height: 15),
                      CustomGradientButton(
                        text: "Update",
                        onPressed: () async {
                          // Check if the gender is selected
                          if (profileUpdationProvider.selectedGender == null) {
                            // Show a snackbar if gender is not selected
                            showCustomSnackBar(
                                context, "Please select a gender.", Colors.red);
                            return; // Exit the method to prevent further execution
                          }

                          // Proceed to validate the rest of the form
                          if (profileUpdationProvider
                              .validateProfileUpdationForm()) {
                            final statusCode =
                                await authProvider.completeUserProfile(
                              profileUpdationProvider.bioController.text,
                              profileUpdationProvider.idnumberController.text
                                  .trim(),
                              profileUpdationProvider.selectedGender
                                  .toString()
                                  .trim(),
                              profileUpdationProvider
                                  .addressCountryController.text
                                  .trim(),
                              profileUpdationProvider
                                  .addressStateController.text
                                  .trim(),
                              profileUpdationProvider.addresCityController.text
                                  .trim(),
                              int.parse(profileUpdationProvider
                                  .addressStreetNumberController.text
                                  .trim()),
                              profileUpdationProvider
                                  .addressPostalCodeController.text
                                  .trim(),
                            );

                            // Handle navigation based on status code
                            if (statusCode == 200) {
                              showCustomSnackBar(
                                context,
                                "Profile is Updated!",
                                Colors.green,
                              );
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
