import NumberSelectGroup from "@/components/NumberSelectGroup/NumberSelectGroup";
import StepTitle from "@/components/Text/StepTitle";
import { HStack } from "@chakra-ui/react";
import styles from "./page.module.css";
import ContentContaner from "@/components/ContentContaner";
import StepContainer from "@/components/StepContainer";
import StepContentContainer from "@/components/StepContentContainer";

export default function Home() {
  return (
    <main className={styles.main}>
      <ContentContaner>
        <StepContainer>
          <StepTitle step={1} title="Choose your numbers" />
          <StepContentContainer>
            <HStack gap={8}>
              <NumberSelectGroup nthNumber={0} />
              <NumberSelectGroup nthNumber={1} />
              <NumberSelectGroup nthNumber={2} />
              <NumberSelectGroup nthNumber={3} />
            </HStack>
          </StepContentContainer>
        </StepContainer>
      </ContentContaner>
    </main>
  );
}
