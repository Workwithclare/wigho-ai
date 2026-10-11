"use client";

import React from 'react';
import { WihgoSplashMotionDashboard } from '../../components/showcase/WihgoSplashMotionDashboard';

export default function ShowcasePage() {
  return (
    <WihgoSplashMotionDashboard
      initialStage="splash"
      autoPlaySequence={false}
    />
  );
}
